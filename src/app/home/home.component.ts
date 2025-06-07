import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

interface CarouselItem {
  title: string;
  description: string;
  imageUrl: string;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  template: `
    <div class="home-container">
      <h1 class="main-title">✨Calculus Mastery✨</h1>
      
      <!-- Carousel -->
      <div class="carousel">
        <div class="carousel-content" [style.transform]="'translateX(-' + (currentSlide * 100) + '%)'">
          <div class="carousel-item" *ngFor="let item of carouselItems">
            <img [src]="item.imageUrl" [alt]="item.title">
            <div class="carousel-text">
              <h2>{{item.title}}</h2>
              <p>{{item.description}}</p>
            </div>
          </div>
        </div>
        <div class="carousel-dots">
          <span *ngFor="let item of carouselItems; let i = index" 
                [class.active]="i === currentSlide"
                (click)="currentSlide = i"></span>
        </div>
      </div>

      <!-- Features -->
      <div class="features">
        <h2>What We Offer</h2>
        <div class="features-grid">
          <div class="feature" *ngFor="let feature of features">
            <mat-icon>{{feature.icon}}</mat-icon>
            <h3>{{feature.title}}</h3>
            <p>{{feature.description}}</p>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="cta">
        <button mat-raised-button color="primary" routerLink="/lessons">
          Start Learning
          <mat-icon>arrow_forward</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .main-title {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 2rem;
      color: #1a73e8;
    }

    .carousel {
      position: relative;
      width: 100%;
      height: 400px;
      overflow: hidden;
      border-radius: 12px;
      margin-bottom: 3rem;
    }

    .carousel-content {
      display: flex;
      transition: transform 0.5s ease-in-out;
      height: 100%;
    }

    .carousel-item {
      flex: 0 0 100%;
      position: relative;
    }

    .carousel-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .carousel-text {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 2rem;
      background: linear-gradient(transparent, rgba(0,0,0,0.8));
      color: white;
    }

    .carousel-dots {
      position: absolute;
      bottom: 1rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 0.5rem;
    }

    .carousel-dots span {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgba(255,255,255,0.5);
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .carousel-dots span.active {
      background: white;
      transform: scale(1.2);
    }

    .features {
      padding: 3rem 0;
    }

    .features h2 {
      text-align: center;
      margin-bottom: 2rem;
      font-size: 2rem;
      color: #202124;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .feature {
      text-align: center;
      padding: 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      transition: transform 0.3s ease;
    }

    .feature:hover {
      transform: translateY(-5px);
    }

    .feature mat-icon {
      font-size: 2.5rem;
      height: 2.5rem;
      width: 2.5rem;
      color: #1a73e8;
      margin-bottom: 1rem;
    }

    .feature h3 {
      margin-bottom: 1rem;
      color: #202124;
    }

    .feature p {
      color: #5f6368;
      line-height: 1.5;
    }

    .cta {
      text-align: center;
      padding: 3rem 0;
    }

    .cta button {
      padding: 1rem 2rem;
      font-size: 1.2rem;
    }

    .cta mat-icon {
      margin-left: 0.5rem;
    }
  `]
})
export class HomeComponent implements OnInit {
  currentSlide = 0;
  
  carouselItems: CarouselItem[] = [
    {
      title: 'Limits and Continuity',
      description: '',
      imageUrl: 'https://i.ytimg.com/vi/9brk313DjV8/maxresdefault.jpg'
    },
    {
      title: 'Derivatives',
      description: '',
      imageUrl: 'https://i.ytimg.com/vi/5yfh5cf4-0w/sddefault.jpg'
    },
    {
      title: 'Integration',
      description: '',
      imageUrl: 'https://cdn1.byjus.com/wp-content/uploads/2020/01/integral-formulas-11.jpg'
    },
    {
      title: 'Taylor Series',
      description: '',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZa4siV_94OFDAyxEuY3XPLkjFq7j6l8khsA&s'
    },
    {
      title: "Newton's Method",
      description: '',
      imageUrl: 'https://www.mathwords.com/n/n_assets/n18.gif'
    },
    {
      title: "Fundamental Theorem of Calculus",
      description: '',
      imageUrl: 'https://www.mathwords.com/n/n_assets/n18.gif'
    }
  ];

  features: Feature[] = [
    {
      icon: 'school',
      title: 'Structured Learning',
      description: 'Follow our carefully designed curriculum to build your calculus knowledge step by step.'
    },
    {
      icon: 'psychology',
      title: 'Interactive Practice',
      description: 'Reinforce your learning with our extensive collection of practice problems and quizzes.'
    },
    {
      icon: 'auto_stories',
      title: 'Clear Explanations',
      description: 'Complex concepts broken down into easy-to-understand lessons with visual aids.'
    },
    {
      icon: 'track_changes',
      title: 'Track Progress',
      description: 'Monitor your understanding with immediate feedback and progress tracking.'
    },
    {
      icon: 'devices',
      title: 'Learn Anywhere',
      description: 'Access your lessons on any device, anytime, anywhere.'
    },
    {
      icon: 'groups',
      title: 'Community Support',
      description: 'Join a community of learners and help each other succeed.'
    }
  ];

  ngOnInit() {
    // Auto-advance carousel
    setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.carouselItems.length;
    }, 5000);
  }
} 