import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
    MatIconModule
  ],
  template: `
    <mat-toolbar color="primary">
      <span class="title">✨Master Calculus✨</span>
      <span class="spacer"></span>
      <a mat-button routerLink="/home" [class.active]="isRouteActive('home')">Home</a>
      <a mat-button routerLink="/about" [class.active]="isRouteActive('about')">About</a>
      <a mat-button routerLink="/lessons" [class.active]="isRouteActive('lessons')">Lessons</a>
      <a mat-button routerLink="/practice" [class.active]="isRouteActive('practice')">Practice</a>
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
  `]
})
export class TopbarComponent {
  @Input() isRouteActive!: (route: string) => boolean;
}
