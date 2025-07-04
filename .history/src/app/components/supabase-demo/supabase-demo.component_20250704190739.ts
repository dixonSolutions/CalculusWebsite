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

  constructor(private readonly supabase: SupabaseService) {}

  async ngOnInit() {
    try {
      // Get current session
      this.session = await this.supabase.getCurrentSession();
      this.loading = false;

      console.log('Demo component session state:', { 
        session: this.session, 
        hasUser: !!this.session?.user,
        isPhoneUser: this.supabase.isPhoneUser(),
        phoneNumber: this.supabase.getPhoneNumber()
      });

      // Listen for auth changes
      this.supabase.authChanges((event, session) => {
        console.log('Auth change in demo component:', event, session);
        this.session = session;
      });
      
    } catch (error) {
      console.error('Error during initialization:', error);
      this.loading = false;
    }
  }
} 