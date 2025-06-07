import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TopbarComponent } from './topbar/topbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TopbarComponent
  ],
  template: `
    <app-topbar [isRouteActive]="isRouteActive.bind(this)"></app-topbar>
    <div class="content">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
    .content {
      padding-top: 64px; /* Height of the toolbar */
      min-height: calc(100vh - 64px);
      background-color: #f8f9fa;
    }
  `]
})
export class AppComponent {
  title = '✨Master Calculus✨';
  currentRoute: string = '';

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
} 