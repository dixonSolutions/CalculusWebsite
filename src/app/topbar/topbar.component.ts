import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InstallButtonComponent } from '../components/install-button/install-button.component';

interface NavItem {
  label: string;
  link: string;
  icon?: string;
}

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    InstallButtonComponent
  ],
  template: `
    <mat-toolbar color="primary">
      <span class="title">✨Master Calculus✨</span>
      <span class="spacer"></span>
      
      <!-- Desktop Navigation -->
      <div class="desktop-nav">
        <a mat-button routerLink="/home" [class.active]="isRouteActive('home')">Home</a>
        <a mat-button routerLink="/about" [class.active]="isRouteActive('about')">About</a>
        <a mat-button routerLink="/lessons" [class.active]="isRouteActive('lessons')">Lessons</a>
        <a mat-button routerLink="/practice" [class.active]="isRouteActive('practice')">Practice</a>
        <app-install-button></app-install-button>
      </div>

      <!-- Mobile Navigation Button -->
      <button mat-icon-button class="mobile-menu-btn" (click)="openMenu()">
        <mat-icon>menu</mat-icon>
      </button>
    </mat-toolbar>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
    .title {
      font-size: 1.5rem;
      font-weight: 500;
    }
    .active {
      background-color: rgba(255, 255, 255, 0.1);
      font-weight: 500;
    }
    mat-toolbar {
      position: fixed;
      top: 0;
      z-index: 1000;
    }
    .desktop-nav {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .mobile-menu-btn {
      display: none;
      color: white;
    }
    @media (max-width: 768px) {
      .desktop-nav {
        display: none;
      }
      .mobile-menu-btn {
        display: inline-flex;
      }
      .title {
        font-size: 1.2rem;
      }
    }
  `]
})
export class TopbarComponent {
  @Input() isRouteActive!: (route: string) => boolean;
  @Input() openMenu!: () => void;
}
