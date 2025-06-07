import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <div class="about-container">
      <h1>About Us</h1>
      
      <mat-card class="about-card">
        <mat-card-content>
          <h2>Our Mission</h2>
          <p>
            We are dedicated to making calculus accessible and understandable for everyone. 
            Our platform combines comprehensive lessons, interactive practice, and immediate feedback 
            to help you master calculus concepts at your own pace.
          </p>

          <h2>What We Offer</h2>
          <ul>
            <li>Structured learning path from basic to advanced concepts</li>
            <li>Interactive practice problems with detailed solutions</li>
            <li>Comprehensive quizzes to test your understanding</li>
            <li>Visual aids and examples to reinforce learning</li>
            <li>Progress tracking to monitor your improvement</li>
          </ul>

          <h2>Our Approach</h2>
          <p>
            We believe that learning calculus should be an engaging and rewarding experience. 
            Our lessons are designed to break down complex concepts into manageable pieces, 
            while our practice problems help reinforce your understanding through hands-on application.
          </p>

          <h2>Get Started</h2>
          <p>
            Whether you're a student looking to improve your grades, a professional seeking to enhance 
            your mathematical skills, or simply curious about calculus, we're here to help you succeed. 
            Start with our lessons or jump right into practice problems - the choice is yours!
          </p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .about-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    h1 {
      color: #202124;
      text-align: center;
      margin-bottom: 2rem;
    }

    .about-card {
      padding: 2rem;
    }

    h2 {
      color: #1a73e8;
      margin-top: 2rem;
      margin-bottom: 1rem;
    }

    h2:first-child {
      margin-top: 0;
    }

    p {
      color: #5f6368;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    ul {
      color: #5f6368;
      line-height: 1.6;
      margin-bottom: 1.5rem;
      padding-left: 1.5rem;
    }

    li {
      margin-bottom: 0.5rem;
    }
  `]
})
export class AboutComponent {
  mission = {
    title: 'Our Mission',
    description: 'To make calculus learning accessible, interactive, and enjoyable for students worldwide. We believe in providing high-quality educational content that helps students build a strong foundation in mathematics.',
    values: [
      'Interactive Learning',
      'Clear Explanations',
      'Practical Applications',
      'Student Success'
    ]
  };

  features = [
    {
      icon: 'school',
      title: 'Structured Curriculum',
      description: 'Carefully designed lessons that build upon each other'
    },
    {
      icon: 'psychology',
      title: 'Interactive Practice',
      description: 'Hands-on exercises and quizzes to reinforce learning'
    },
    {
      icon: 'auto_stories',
      title: 'Rich Content',
      description: 'Visual aids and detailed explanations'
    },
    {
      icon: 'support',
      title: 'Student Support',
      description: 'Comprehensive resources and guidance'
    }
  ];

  team: TeamMember[] = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Lead Mathematics Educator',
      bio: 'PhD in Mathematics Education with 15 years of teaching experience',
      imageUrl: 'assets/images/team/sarah.jpg'
    },
    {
      name: 'Prof. Michael Chen',
      role: 'Content Developer',
      bio: 'Specializes in creating engaging mathematical content and visualizations',
      imageUrl: 'assets/images/team/michael.jpg'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Educational Technology Expert',
      bio: 'Masters in EdTech, focuses on interactive learning experiences',
      imageUrl: 'assets/images/team/emma.jpg'
    }
  ];
} 