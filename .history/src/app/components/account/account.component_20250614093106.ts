import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthSession } from '@supabase/supabase-js';
import { Profile, SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  loading = false;
  profile!: Profile;
  isNewUser = false;
  signInTime = new Date();

  @Input()
  session!: AuthSession;

  updateProfileForm = this.formBuilder.group({
    username: '',
    website: '',
    avatar_url: '',
  });

  constructor(
    private readonly supabase: SupabaseService,
    private formBuilder: FormBuilder
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getOrCreateProfile();

    if (this.profile) {
      const { username, website, avatar_url } = this.profile;
      this.updateProfileForm.patchValue({
        username,
        website,
        avatar_url,
      });
    }
  }

  async getOrCreateProfile() {
    try {
      this.loading = true;
      const { user } = this.session;
      const { data: profile, error } = await this.supabase.getOrCreateProfile(user);

      if (error) {
        throw error;
      }

      if (profile) {
        this.profile = profile;
        // Check if this is a newly created profile (created within the last minute)
        if (profile.created_at) {
          const createdTime = new Date(profile.created_at);
          const timeDiff = Date.now() - createdTime.getTime();
          this.isNewUser = timeDiff < 60000; // Less than 1 minute ago
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      this.loading = false;
    }
  }

  async updateProfile(): Promise<void> {
    try {
      this.loading = true;
      const { user } = this.session;

      const username = this.updateProfileForm.value.username as string;
      const website = this.updateProfileForm.value.website as string;
      const avatar_url = this.updateProfileForm.value.avatar_url as string;

      const { error } = await this.supabase.updateProfile({
        id: user.id,
        username,
        website,
        avatar_url,
      });

      if (error) throw error;
      
      // Update local profile
      this.profile = {
        ...this.profile,
        username,
        website,
        avatar_url,
      };
      
      alert('Profile updated successfully!');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      this.loading = false;
    }
  }

  async signOut() {
    await this.supabase.signOut();
  }

  getWelcomeMessage(): string {
    if (this.isNewUser) {
      return `🎉 Welcome to Master Calculus! Your account has been created successfully.`;
    }
    return `👋 Welcome back, ${this.profile?.username || 'User'}!`;
  }
} 