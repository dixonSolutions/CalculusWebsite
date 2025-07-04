import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { InstallButtonComponent } from '../install-button/install-button.component';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    InstallButtonComponent
  ],
  template: `
    <div class="mobile-menu-root">
      <mat-nav-list>
        <a mat-list-item routerLink="/home" (click)="closeMenu.emit()" [class.active]="isRouteActive('home')">
          <mat-icon>home</mat-icon>
          <span>Home</span>
        </a>
        <a mat-list-item routerLink="/about" (click)="closeMenu.emit()" [class.active]="isRouteActive('about')">
          <mat-icon>info</mat-icon>
          <span>About</span>
        </a>
        <a mat-list-item routerLink="/lessons" (click)="closeMenu.emit()" [class.active]="isRouteActive('lessons')">
          <mat-icon>school</mat-icon>
          <span>Lessons</span>
        </a>
        <a mat-list-item routerLink="/practice" (click)="closeMenu.emit()" [class.active]="isRouteActive('practice')">
          <mat-icon>assignment</mat-icon>
          <span>Practice</span>
        </a>
        <a mat-list-item routerLink="/auth" (click)="closeMenu.emit()" [class.active]="isRouteActive('auth')">
          <mat-icon>login</mat-icon>
          <span>Auth</span>
        </a>
        <div class="install-button-container">
          <app-install-button></app-install-button>
        </div>
      </mat-nav-list>
    </div>
  `,
  styles: [`
    .mobile-menu-root {
      height: 100%;
      background: #4338ca;
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
    mat-nav-list {
      padding-top: 16px;
      background: transparent;
      color: white;
    }
    mat-nav-list a {
      color: white;
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 16px;
    }
    mat-nav-list a mat-icon {
      margin-right: 8px;
      color: white;
    }
    .active {
      background-color: rgba(255, 255, 255, 0.1);
    }
    .install-button-container {
      padding: 16px;
    }
    :host ::ng-deep .install-button {
      width: 100%;
      justify-content: center;
    }
  `]
})
export class MobileMenuComponent {
  @Input() isRouteActive!: (route: string) => boolean;
  @Output() closeMenu = new EventEmitter<void>();
} 