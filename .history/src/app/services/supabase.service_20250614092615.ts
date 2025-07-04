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