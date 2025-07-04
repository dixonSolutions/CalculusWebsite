import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="callback-container">
      <div class="callback-content">
        <div class="spinner"></div>
        <h2>{{ message }}</h2>
        <p>{{ subMessage }}</p>
      </div>
    </div>
  `,
  styles: [`
    .callback-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    .callback-content {
      text-align: center;
      padding: 40px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      backdrop-filter: blur(10px);
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top: 4px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    h2 {
      margin: 0 0 10px 0;
      font-size: 1.5rem;
    }
    
    p {
      margin: 0;
      opacity: 0.9;
    }
  `]
})
export class AuthCallbackComponent implements OnInit {
  message = 'Signing you in...';
  subMessage = 'Please wait while we complete your authentication.';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private supabase: SupabaseService
  ) {}

  async ngOnInit() {
    try {
      // Handle the authentication callback
      const { data, error } = await this.supabase.client.auth.getSession();
      
      if (error) {
        console.error('Auth callback error:', error);
        this.message = 'Authentication Error';
        this.subMessage = 'There was an error signing you in. Please try again.';
        
        setTimeout(() => {
          this.router.navigate(['/auth']);
        }, 3000);
        return;
      }

      if (data.session) {
        console.log('Authentication successful:', data.session.user.email);
        this.message = 'Success!';
        this.subMessage = `Welcome, ${data.session.user.email}!`;
        
        // Create or get user profile
        try {
          await this.supabase.getOrCreateProfile(data.session.user);
        } catch (profileError) {
          console.error('Profile setup error:', profileError);
        }
        
        // Redirect to auth page to show the welcome message
        setTimeout(() => {
          this.router.navigate(['/auth']);
        }, 2000);
      } else {
        this.message = 'No Session Found';
        this.subMessage = 'Redirecting to sign in...';
        
        setTimeout(() => {
          this.router.navigate(['/auth']);
        }, 2000);
      }
    } catch (error) {
      console.error('Callback handling error:', error);
      this.message = 'Something went wrong';
      this.subMessage = 'Redirecting to sign in...';
      
      setTimeout(() => {
        this.router.navigate(['/auth']);
      }, 3000);
    }
  }
} 