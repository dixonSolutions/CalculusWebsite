import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';
import { SignInComponent } from '../sign-in/sign-in.component';
import { AccountComponent } from '../account/account.component';

@Component({
  selector: 'app-supabase-demo',
  standalone: true,
  imports: [CommonModule, SignInComponent, AccountComponent],
  templateUrl: './supabase-demo.component.html',
  styleUrls: ['./supabase-demo.component.css'],
})
export class SupabaseDemoComponent implements OnInit {
  session = this.supabase.session;
  loading = true;
  isPhoneAuth = false;

  constructor(private readonly supabase: SupabaseService) {}

  async ngOnInit() {
    try {
      // Check for regular Supabase session first
      this.session = await this.supabase.getCurrentSession();
      
      // If no regular session, check for phone authentication
      if (!this.session && this.supabase.isPhoneAuthenticated()) {
        this.session = this.supabase.session; // This will return the phone session
        this.isPhoneAuth = true;
        console.log('Phone authentication detected in demo component');
      }
      
      this.loading = false;
      console.log('Demo component session state:', { 
        session: this.session, 
        isPhoneAuth: this.isPhoneAuth,
        hasUser: !!this.session?.user 
      });

      // Listen for auth changes (this will be handled globally, but we still need to update local state)
      this.supabase.authChanges((event, session) => {
        console.log('Auth change in demo component:', event, session);
        this.session = session;
        this.isPhoneAuth = false; // Regular Supabase auth
      });

      // Listen for phone auth change events
      window.addEventListener('phoneAuthChange', (event: any) => {
        console.log('Phone auth change in demo component:', event.detail);
        if (event.detail.authenticated) {
          this.session = this.supabase.session;
          this.isPhoneAuth = true;
          console.log('Demo component updated for phone auth:', this.session);
        } else {
          if (this.isPhoneAuth) {
            this.session = null;
            this.isPhoneAuth = false;
          }
        }
      });
      
    } catch (error) {
      console.error('Error during initialization:', error);
      this.loading = false;
    }
  }
} 