import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TopbarComponent } from './topbar/topbar.component';
import { CommonModule } from '@angular/common';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MobileMenuComponent } from './components/mobile-menu/mobile-menu.component';
import { SupabaseService } from './services/supabase.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TopbarComponent,
    MatSidenavModule,
    MobileMenuComponent
  ],
  template: `
    <mat-sidenav-container class="main-container">
      <mat-sidenav #sidenav mode="over" position="end" class="mobile-sidenav">
        <app-mobile-menu [isRouteActive]="isRouteActive.bind(this)" (closeMenu)="sidenav.close()"></app-mobile-menu>
      </mat-sidenav>
      <mat-sidenav-content>
        <app-topbar [isRouteActive]="isRouteActive.bind(this)" [openMenu]="openMenu"></app-topbar>
    <div class="content">
      <router-outlet></router-outlet>
    </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
    .main-container {
      min-height: 100vh;
    }
    .content {
      padding-top: 64px; /* Height of the toolbar */
      min-height: calc(100vh - 64px);
      background-color: #f8f9fa;
    }
    .mobile-sidenav {
      width: 250px;
      background: #4338ca;
      color: white;
    }
  `]
})
export class AppComponent implements OnInit {
  title = '✨Master Calculus✨';
  currentRoute: string = '';

  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(
    private router: Router,
    private supabase: SupabaseService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Get the base route without query params
      this.currentRoute = event.url.split('?')[0].split('/')[1] || 'home';
    });
  }

  async ngOnInit() {
    // Handle authentication state changes globally
    this.supabase.authChanges(async (event, session) => {
      console.log('Global auth event:', event, session);
      
      if (event === 'SIGNED_IN' && session) {
        console.log('User signed in successfully:', session.user.email);
        
        // Create or get user profile
        try {
          const { data: profile, error } = await this.supabase.getOrCreateProfile(session.user);
          if (error) {
            console.error('Error creating/getting profile:', error);
          } else {
            console.log('User profile ready:', profile);
          }
        } catch (error) {
          console.error('Profile setup error:', error);
        }
        
        // Redirect to auth page to show the welcome message
        if (this.currentRoute !== 'auth') {
          this.router.navigate(['/auth']);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        // Optionally redirect to home or sign-in page
        if (this.currentRoute === 'auth') {
          this.router.navigate(['/home']);
        }
      }
    });

    // Check for phone authentication state on initialization
    this.checkPhoneAuthState();
    
    // Listen for custom phone auth change events
    window.addEventListener('phoneAuthChange', (event: any) => {
      console.log('Phone auth change event received:', event.detail);
      if (event.detail.authenticated && this.currentRoute !== 'auth') {
        console.log('Phone user authenticated, navigating to auth page');
        this.router.navigate(['/auth']);
      }
    });
    
    // Set up a periodic check for phone authentication as backup
    setInterval(() => {
      this.checkPhoneAuthState();
    }, 3000); // Check every 3 seconds as backup
  }

  private checkPhoneAuthState() {
    const isPhoneAuth = this.supabase.isPhoneAuthenticated();
    const phoneUser = this.supabase.getPhoneUser();
    
    // Only log when there's a change in auth state
    if (isPhoneAuth && phoneUser && this.currentRoute !== 'auth') {
      console.log('Phone authentication detected, current route:', this.currentRoute);
      console.log('Phone user:', phoneUser);
      
      // Phone user is signed in, redirect to auth page to show account
      this.router.navigate(['/auth']);
    }
  }

  isRouteActive(route: string): boolean {
    return this.currentRoute === route;
  }

  openMenu = () => {
    this.sidenav.open();
  }
} 