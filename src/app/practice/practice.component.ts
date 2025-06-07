import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';

interface QuizSection {
  name: string;
  description: string;
  quizzes: {
    id: number;
    name: string;
    description: string;
  }[];
}

@Component({
  selector: 'app-practice',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    RouterModule
  ],
  template: `
    <div class="practice-container">
      <h1>Practice Quizzes</h1>
      <p class="practice-description">
        Test your knowledge with our comprehensive collection of quizzes. Each section contains multiple quizzes to help you master calculus concepts.
      </p>

      <mat-accordion>
        <mat-expansion-panel *ngFor="let section of sections">
          <mat-expansion-panel-header>
            <mat-panel-title>{{section.name}}</mat-panel-title>
            <mat-panel-description>{{section.description}}</mat-panel-description>
          </mat-expansion-panel-header>

          <div class="quiz-grid">
            <mat-card *ngFor="let quiz of section.quizzes" class="quiz-card">
              <mat-card-header>
                <mat-card-title>{{quiz.name}}</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p>{{quiz.description}}</p>
              </mat-card-content>
              <mat-card-actions>
                <button mat-raised-button color="primary" [routerLink]="['/quiz']" [queryParams]="{id: quiz.id}">
                  <mat-icon>quiz</mat-icon>
                  Start Quiz
                </button>
              </mat-card-actions>
            </mat-card>
          </div>
        </mat-expansion-panel>
      </mat-accordion>
    </div>
  `,
  styles: [`
    .practice-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      color: #202124;
      margin-bottom: 1rem;
      text-align: center;
    }

    .practice-description {
      color: #5f6368;
      text-align: center;
      max-width: 800px;
      margin: 0 auto 2rem;
      line-height: 1.6;
    }

    .quiz-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-top: 1.5rem;
    }

    .quiz-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .quiz-card mat-card-header {
      margin-bottom: 1rem;
    }

    .quiz-card mat-card-title {
      color: #202124;
      font-size: 1.2rem;
    }

    .quiz-card mat-card-content {
      flex: 1;
      color: #5f6368;
      line-height: 1.5;
    }

    .quiz-card mat-card-actions {
      padding: 1rem;
      display: flex;
      justify-content: flex-end;
    }

    .quiz-card button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    mat-expansion-panel {
      margin-bottom: 1rem;
    }

    mat-panel-title {
      color: #202124;
      font-weight: 500;
    }

    mat-panel-description {
      color: #5f6368;
    }
  `]
})
export class PracticeComponent {
  sections: QuizSection[] = [
    {
      name: 'Limits and Continuity',
      description: 'Test your understanding of limits and continuity concepts',
      quizzes: [
        {
          id: 1,
          name: 'Basic Limits Concepts',
          description: 'Practice fundamental limit concepts and evaluations'
        },
        {
          id: 2,
          name: 'One-Sided Limits',
          description: 'Test your knowledge of left and right-hand limits'
        },
        {
          id: 3,
          name: 'Limit Properties',
          description: 'Practice using limit properties and special limits'
        }
      ]
    },
    {
      name: 'Derivatives',
      description: 'Practice differentiation techniques and applications',
      quizzes: [
        {
          id: 4,
          name: 'Basic Derivatives',
          description: 'Test your knowledge of fundamental derivative rules'
        },
        {
          id: 5,
          name: 'Chain Rule Applications',
          description: 'Practice applying the chain rule to various functions'
        },
        {
          id: 6,
          name: 'Product and Quotient Rules',
          description: 'Master the application of product and quotient rules'
        }
      ]
    },
    {
      name: 'Integration',
      description: 'Test your integration skills and techniques',
      quizzes: [
        {
          id: 7,
          name: 'Basic Integration Techniques',
          description: 'Practice fundamental integration methods and rules'
        },
        {
          id: 8,
          name: 'Integration Applications',
          description: 'Apply integration to solve real-world problems'
        },
        {
          id: 9,
          name: 'Integration by Parts and Substitution',
          description: 'Master advanced integration techniques'
        }
      ]
    },
    {
      name: 'Series and Sequences',
      description: 'Practice with infinite series and convergence',
      quizzes: [
        {
          id: 10,
          name: 'Series and Sequences',
          description: 'Test your knowledge of infinite series and sequences'
        },
        {
          id: 11,
          name: 'Taylor Series',
          description: 'Master Taylor and Maclaurin series expansions'
        },
        {
          id: 12,
          name: 'Convergence Tests',
          description: 'Practice applying various convergence tests for series'
        }
      ]
    }
  ];
} 