import { Injectable } from '@angular/core';
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export interface Profile {
  id?: string;
  username: string;
  website: string;
  avatar_url: string;
  created_at?: string;
  updated_at?: string;
}

// Database interfaces for lessons
export interface DatabaseLesson {
  id: number;
  uuid: string;
  name: string;
  description?: string;
  type: 'section' | 'lesson';
  parent_id?: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseSlide {
  id: number;
  uuid: string;
  lesson_id: number;
  title: string;
  content: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseSlideImage {
  id: number;
  uuid: string;
  slide_id: number;
  url: string;
  caption?: string;
  sort_order: number;
  created_at: string;
}

export interface DatabaseSlideExample {
  id: number;
  uuid: string;
  slide_id: number;
  example_text: string;
  sort_order: number;
  created_at: string;
}

export interface DatabaseLessonQuiz {
  id: number;
  lesson_id: number;
  quiz_id: number;
  sort_order: number;
  created_at: string;
}

// Frontend interfaces (matching existing structure)
export interface Slide {
  title: string;
  content: string;
  images?: Array<{
    url: string;
    caption: string;
  }>;
  examples?: string[];
}

export interface LessonNode {
  id?: number;
  name: string;
  description?: string;
  type: 'section' | 'lesson';
  children?: LessonNode[];
  slides?: Slide[];
  quizIds?: number[];
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  _session: AuthSession | null = null;

  constructor() {
    this.supabase = createClient(environment.supabase.url, environment.supabase.anonKey);
    
    // Initialize session on service creation
    this.initializeSession();
  }

  // Public getter for the Supabase client
  get client() {
    return this.supabase;
  }

  private async initializeSession() {
    try {
      const { data, error } = await this.supabase.auth.getSession();
      if (error) {
        console.error('Error getting initial session:', error);
      } else {
        this._session = data.session;
        if (this._session) {
          console.log('Initial session found:', this._session.user.email);
        }
      }
    } catch (error) {
      console.error('Session initialization error:', error);
    }
  }

  get session() {
    return this._session;
  }

  async getCurrentSession() {
    try {
      const { data, error } = await this.supabase.auth.getSession();
      if (error) {
        console.error('Error getting current session:', error);
        return null;
      }
      this._session = data.session;
      return this._session;
    } catch (error) {
      console.error('Get current session error:', error);
      return null;
    }
  }

  // Lessons methods
  async getAllLessons(): Promise<{ data: LessonNode[] | null; error: any }> {
    try {
      console.log('Fetching all lessons from database...');
      
      // Get all lessons and sections
      const { data: lessons, error: lessonsError } = await this.supabase
        .from('lessons')
        .select('*')
        .order('sort_order');

      if (lessonsError) {
        console.error('Error fetching lessons:', lessonsError);
        return { data: null, error: lessonsError };
      }

      // Get all slides with their examples and images
      const { data: slides, error: slidesError } = await this.supabase
        .from('lesson_slides')
        .select(`
          *,
          lesson_slide_examples(example_text, sort_order),
          lesson_slide_images(url, caption, sort_order)
        `)
        .order('sort_order');

      if (slidesError) {
        console.error('Error fetching slides:', slidesError);
        return { data: null, error: slidesError };
      }

      // Get all lesson-quiz associations
      const { data: lessonQuizzes, error: quizzesError } = await this.supabase
        .from('lesson_quizzes')
        .select('*')
        .order('sort_order');

      if (quizzesError) {
        console.error('Error fetching lesson quizzes:', quizzesError);
        return { data: null, error: quizzesError };
      }

      // Transform the data to match the frontend structure
      const lessonTree = this.buildLessonTree(lessons as DatabaseLesson[], slides as any[], lessonQuizzes as DatabaseLessonQuiz[]);
      
      console.log('Successfully fetched and transformed lessons:', lessonTree.length);
      return { data: lessonTree, error: null };
    } catch (error) {
      console.error('getAllLessons error:', error);
      return { data: null, error };
    }
  }

  private buildLessonTree(
    lessons: DatabaseLesson[], 
    slides: any[], 
    lessonQuizzes: DatabaseLessonQuiz[]
  ): LessonNode[] {
    // Create a map for quick lookups
    const lessonMap = new Map<number, LessonNode>();
    const slidesMap = new Map<number, Slide[]>();
    const quizzesMap = new Map<number, number[]>();

    // Build slides map
    slides.forEach(slide => {
      const transformedSlide: Slide = {
        title: slide.title,
        content: slide.content,
        examples: slide.lesson_slide_examples
          ?.sort((a: any, b: any) => a.sort_order - b.sort_order)
          .map((ex: any) => ex.example_text) || [],
        images: slide.lesson_slide_images
          ?.sort((a: any, b: any) => a.sort_order - b.sort_order)
          .map((img: any) => ({ url: img.url, caption: img.caption || '' })) || []
      };

      if (!slidesMap.has(slide.lesson_id)) {
        slidesMap.set(slide.lesson_id, []);
      }
      slidesMap.get(slide.lesson_id)!.push(transformedSlide);
    });

    // Build quizzes map
    lessonQuizzes.forEach(lq => {
      if (!quizzesMap.has(lq.lesson_id)) {
        quizzesMap.set(lq.lesson_id, []);
      }
      quizzesMap.get(lq.lesson_id)!.push(lq.quiz_id);
    });

    // Transform lessons to LessonNode format
    lessons.forEach(lesson => {
      const lessonNode: LessonNode = {
        id: lesson.id,
        name: lesson.name,
        description: lesson.description,
        type: lesson.type,
        children: lesson.type === 'section' ? [] : undefined,
        slides: lesson.type === 'lesson' ? slidesMap.get(lesson.id) || [] : undefined,
        quizIds: lesson.type === 'lesson' ? quizzesMap.get(lesson.id) || [] : undefined
      };
      lessonMap.set(lesson.id, lessonNode);
    });

    // Build the tree structure
    const rootNodes: LessonNode[] = [];
    
    lessons.forEach(lesson => {
      const lessonNode = lessonMap.get(lesson.id)!;
      
      if (lesson.parent_id === null) {
        // This is a root section
        rootNodes.push(lessonNode);
      } else {
        // This is a child lesson
        const parent = lessonMap.get(lesson.parent_id);
        if (parent && parent.children) {
          parent.children.push(lessonNode);
        }
      }
    });

    // Sort children within each section
    rootNodes.forEach(section => {
      if (section.children) {
        section.children.sort((a, b) => {
          const lessonA = lessons.find(l => l.id === a.id);
          const lessonB = lessons.find(l => l.id === b.id);
          return (lessonA?.sort_order || 0) - (lessonB?.sort_order || 0);
        });
      }
    });

    return rootNodes.sort((a, b) => {
      const lessonA = lessons.find(l => l.id === a.id);
      const lessonB = lessons.find(l => l.id === b.id);
      return (lessonA?.sort_order || 0) - (lessonB?.sort_order || 0);
    });
  }

  profile(user: User) {
    return this.supabase
      .from('profiles')
      .select(`id, username, website, avatar_url, created_at, updated_at`)
      .eq('id', user.id)
      .single();
  }

  async createProfile(user: User) {
    const profile = {
      id: user.id,
      username: user.email?.split('@')[0] || 'user',
      website: '',
      avatar_url: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log('Creating new profile for user:', user.email);
    return this.supabase.from('profiles').insert(profile);
  }

  async getOrCreateProfile(user: User) {
    try {
      console.log('Getting or creating profile for user:', user.email);
      
      // Try to get existing profile
      const { data: profile, error } = await this.profile(user);
      
      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        console.log('Profile not found, creating new profile...');
        const { error: createError } = await this.createProfile(user);
        if (createError) {
          console.error('Error creating profile:', createError);
          throw createError;
        }
        
        // Get the newly created profile
        const { data: newProfile, error: getError } = await this.profile(user);
        if (getError) {
          console.error('Error getting newly created profile:', getError);
          throw getError;
        }
        console.log('New profile created successfully:', newProfile);
        return { data: newProfile, error: null };
      }
      
      if (error) {
        console.error('Error getting profile:', error);
        throw error;
      }
      
      console.log('Existing profile found:', profile);
      return { data: profile, error: null };
    } catch (error) {
      console.error('getOrCreateProfile error:', error);
      return { data: null, error };
    }
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      this._session = session;
      callback(event, session);
    });
  }

  signIn(email: string) {
    console.log('Sending magic link to:', email);
    return this.supabase.auth.signInWithOtp({ 
      email,
      options: {
        // Redirect to the auth callback page after clicking the magic link
        emailRedirectTo: `${window.location.origin}/auth-callback`
      }
    });
  }

  signOut() {
    console.log('Signing out user');
    return this.supabase.auth.signOut();
  }

  updateProfile(profile: Profile) {
    const update = {
      ...profile,
      updated_at: new Date().toISOString(),
    };

    console.log('Updating profile:', update);
    return this.supabase.from('profiles').upsert(update);
  }

  downLoadImage(path: string) {
    return this.supabase.storage.from('avatars').download(path);
  }

  uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage.from('avatars').upload(filePath, file);
  }
} 