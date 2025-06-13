import { Component, ViewChild } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TopbarComponent } from './topbar/topbar.component';
import { CommonModule } from '@angular/common';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MobileMenuComponent } from './components/mobile-menu/mobile-menu.component';

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
export class AppComponent {
  title = '✨Master Calculus✨';
  currentRoute: string = '';

  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Get the base route without query params
      this.currentRoute = event.url.split('?')[0].split('/')[1] || 'home';
    });
  }

  isRouteActive(route: string): boolean {
    return this.currentRoute === route;
  }

  openMenu = () => {
    this.sidenav.open();
  }
} 