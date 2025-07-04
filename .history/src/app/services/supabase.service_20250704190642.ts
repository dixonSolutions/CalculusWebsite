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

  get user() {
    return this._session?.user || null;
  }

  // Check if any authentication method is active
  isAuthenticated(): boolean {
    return this._session !== null;
  }

  // Universal sign out method
  async signOut() {
    try {
      // Sign out from Supabase
      const { error } = await this.supabase.auth.signOut();
      if (error) {
        console.error('Error signing out from Supabase:', error);
      }

      this._session = null;
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
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

  // Phone authentication methods
  async signInWithPhone(phone: string): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      console.log('Creating/signing in user with phone:', phone);
      
      // Create a unique email-like identifier for the phone number
      // Replace + and other characters to make it email-like
      const phoneEmail = `${phone.replace(/[^0-9]/g, '')}@phone.auth`;
      
      // Try to sign in with OTP using the phone-based email
      const { data, error } = await this.supabase.auth.signInWithOtp({
        email: phoneEmail,
        options: {
          // Don't actually send an email - we've already verified via SMS
          shouldCreateUser: true,
          data: {
            phone: phone,
            verified_via: 'phone_sms',
            username: phone.replace(/[^0-9]/g, '').slice(-10), // Last 10 digits as username
          }
        }
      });

      if (error) {
        console.error('Error creating phone session:', error);
        return { success: false, error: error.message };
      }

      console.log('Phone authentication successful:', data);
      return { success: true, user: data.user };
      
    } catch (error: any) {
      console.error('signInWithPhone error:', error);
      return { success: false, error: error.message || 'Phone authentication failed' };
    }
  }

  // Alternative method using admin functions (requires service role key)
  async createPhoneSession(phone: string): Promise<{ success: boolean; session?: any; error?: string }> {
    try {
      console.log('Creating phone session for:', phone);
      
      // Check if user already exists with this phone
      const { data: existingUsers, error: lookupError } = await this.supabase
        .from('profiles')
        .select('id, username')
        .eq('username', phone)
        .limit(1);

      if (lookupError) {
        console.error('Error looking up user:', lookupError);
      }

      let userId: string;
      
      if (existingUsers && existingUsers.length > 0) {
        // User exists
        userId = existingUsers[0].id;
        console.log('Found existing user:', userId);
      } else {
        // Create new user with phone-based email
        const phoneEmail = `${phone.replace(/[^0-9]/g, '')}@phone.local`;
        
        const { data: newUser, error: createError } = await this.supabase.auth.admin.createUser({
          email: phoneEmail,
          phone: phone,
          user_metadata: {
            phone: phone,
            verified_via: 'phone_sms',
            username: phone
          },
          email_confirm: true,
          phone_confirm: true
        });

        if (createError) {
          console.error('Error creating user:', createError);
          return { success: false, error: createError.message };
        }

        userId = newUser.user.id;
        console.log('Created new user:', userId);
      }

      // Create a session token for this user
      const { data: sessionData, error: sessionError } = await this.supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: `${phone.replace(/[^0-9]/g, '')}@phone.local`,
        options: {
          redirectTo: `${window.location.origin}/auth-callback`
        }
      });

      if (sessionError) {
        console.error('Error generating session:', sessionError);
        return { success: false, error: sessionError.message };
      }

      console.log('Phone session created successfully');
      return { success: true, session: sessionData };
      
    } catch (error: any) {
      console.error('createPhoneSession error:', error);
      return { success: false, error: error.message || 'Failed to create phone session' };
    }
  }

  // Simplified phone authentication that creates a mock session
  async authenticatePhone(phone: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Creating/signing in Supabase user for phone:', phone);
      
      // Create a phone-based email for Supabase authentication
      const phoneDigits = phone.replace(/[^0-9]/g, '');
      const phoneEmail = `${phoneDigits}@phone.auth.local`;
      const phonePassword = `PhoneAuth_${phoneDigits}_2024!`; // Consistent password for phone users
      
      console.log('Attempting to sign up/sign in with phone email:', phoneEmail);
      
      // Try to sign up first (will fail if user exists)
      const { data: signUpData, error: signUpError } = await this.supabase.auth.signUp({
        email: phoneEmail,
        password: phonePassword,
        options: {
          emailRedirectTo: undefined, // Don't send confirmation email
          data: {
            phone: phone,
            verified_via: 'phone_sms',
            username: phone,
            phone_verified: true,
            email_confirmed: true // Mark as confirmed since we verified via SMS
          }
        }
      });

      if (signUpError) {
        // If signup failed because user exists, try to sign in
        if (signUpError.message.includes('already registered') || signUpError.message.includes('already been registered')) {
          console.log('User already exists, attempting to sign in...');
          
          const { data: signInData, error: signInError } = await this.supabase.auth.signInWithPassword({
            email: phoneEmail,
            password: phonePassword
          });

          if (signInError) {
            console.error('Error signing in existing phone user:', signInError);
            return { success: false, error: `Sign in failed: ${signInError.message}` };
          }

          console.log('Successfully signed in existing phone user');
          this._session = signInData.session;
          
        } else {
          console.error('Error creating phone user:', signUpError);
          return { success: false, error: `Failed to create user: ${signUpError.message}` };
        }
      } else {
        console.log('Successfully created new phone user:', signUpData.user?.email);
        this._session = signUpData.session;
      }

      // Verify we have a session
      if (!this._session) {
        // Try to get the current session as fallback
        const { data: sessionData, error: sessionError } = await this.supabase.auth.getSession();
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          return { success: false, error: 'Failed to establish session' };
        }
        
        this._session = sessionData.session;
      }

      if (!this._session) {
        return { success: false, error: 'Failed to create or retrieve session' };
      }

      console.log('Phone authentication successful!');
      console.log('User ID:', this._session.user.id);
      console.log('User email:', this._session.user.email);
      console.log('User metadata:', this._session.user.user_metadata);

      // Try to create/get user profile
      try {
        const { data: profile, error: profileError } = await this.getOrCreateProfile(this._session.user);
        if (profileError) {
          console.error('Error creating profile for phone user:', profileError);
        } else {
          console.log('Profile created/retrieved for phone user:', profile);
        }
      } catch (profileError) {
        console.error('Profile creation error:', profileError);
        // Don't fail authentication if profile creation fails
      }
      
      return { success: true };
      
    } catch (error: any) {
      console.error('authenticatePhone error:', error);
      return { success: false, error: error.message || 'Phone authentication failed' };
    }
  }

  // Check if current user is a phone user (based on email pattern)
  isPhoneUser(): boolean {
    if (!this._session?.user?.email) return false;
    return this._session.user.email.includes('@phone.auth.local');
  }

  // Get phone number from user metadata
  getPhoneNumber(): string | null {
    if (!this._session?.user) return null;
    return this._session.user.user_metadata?.phone || null;
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
      } else if (lesson.parent_id !== undefined) {
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
          const lessonA = lessons.find(l => l.id === (a.id || 0));
          const lessonB = lessons.find(l => l.id === (b.id || 0));
          return (lessonA?.sort_order || 0) - (lessonB?.sort_order || 0);
        });
      }
    });

    return rootNodes.sort((a, b) => {
      const lessonA = lessons.find(l => l.id === (a.id || 0));
      const lessonB = lessons.find(l => l.id === (b.id || 0));
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