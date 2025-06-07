import { Component, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTreeModule } from '@angular/material/tree';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Slide {
  title: string;
  content: string;
  images?: Array<{
    url: string;
    caption: string;
  }>;
  examples?: string[];
}

interface LessonNode {
  id?: number;
  name: string;
  description?: string;
  type: 'section' | 'lesson';
  children?: LessonNode[];
  slides?: Slide[];
  quizIds?: number[];
}

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    RouterModule
  ]
})
export class LessonsComponent implements OnInit {
  treeControl = new NestedTreeControl<LessonNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<LessonNode>();
  selectedLesson: LessonNode | null = null;
  currentSlideIndex = 0;

  constructor(private router: Router) {
    const TREE_DATA: LessonNode[] = [
      {
        name: 'Limits and Continuity',
        type: 'section',
        description: 'Master the fundamental concepts of limits and continuity',
        children: [
          {
            id: 1,
            name: 'Introduction to Limits',
            type: 'lesson',
            description: 'Understanding the basic concept of limits',
            slides: [
              {
                title: 'What is a Limit?',
                content: 'A limit describes the value that a function approaches as the input approaches some value.',
                examples: [
                  'As x approaches 2, f(x) = x² approaches 4',
                  'As x approaches infinity, 1/x approaches 0'
                ]
              },
              {
                title: 'Evaluating Basic Limits',
                content: 'To evaluate a limit, we can often simply plug in the value, except when this leads to undefined expressions.',
                examples: [
                  'lim(x→2) x² = 4',
                  'lim(x→0) sin(x)/x = 1'
                ]
              }
            ],
            quizIds: [1]
          },
          {
            id: 2,
            name: 'One-Sided Limits',
            type: 'lesson',
            description: 'Learn about limits from the left and right',
            slides: [
              {
                title: 'Left and Right Hand Limits',
                content: 'A one-sided limit examines function behavior when approaching a point from only one direction.',
                examples: [
                  'Left-hand limit: lim(x→a⁻) f(x)',
                  'Right-hand limit: lim(x→a⁺) f(x)'
                ]
              }
            ],
            quizIds: [2]
          }
        ]
      },
      {
        name: 'Derivatives',
        type: 'section',
        description: 'Master differentiation and its applications',
        children: [
          {
            id: 3,
            name: 'Introduction to Derivatives',
            type: 'lesson',
            description: 'Learn what derivatives are and how to calculate them',
            slides: [
              {
                title: 'What is a Derivative?',
                content: 'The derivative of a function represents its rate of change or slope at any point.',
                examples: [
                  'The derivative of f(x) = x² is f\'(x) = 2x',
                  'The derivative represents instantaneous velocity for a position function'
                ]
              }
            ],
            quizIds: [4]
          },
          {
            id: 4,
            name: 'Derivative Rules',
            type: 'lesson',
            description: 'Master the basic rules of differentiation',
            slides: [
              {
                title: 'Basic Derivative Rules',
                content: 'Learn the power rule, product rule, quotient rule, and chain rule.',
                examples: [
                  'Power Rule: d/dx(x^n) = nx^(n-1)',
                  'Product Rule: d/dx(uv) = u(dv/dx) + v(du/dx)'
                ]
              }
            ],
            quizIds: [5, 6]
          }
        ]
      },
      {
        name: 'Integration',
        type: 'section',
        description: 'Explore integral calculus and its applications',
        children: [
          {
            id: 5,
            name: 'Introduction to Integration',
            type: 'lesson',
            description: 'Learn the basics of integration and antiderivatives',
            slides: [
              {
                title: 'What is Integration?',
                content: 'Integration is the reverse process of differentiation and can be used to find areas and accumulation.',
                examples: [
                  '∫x² dx = x³/3 + C',
                  '∫sin(x) dx = -cos(x) + C'
                ]
              }
            ],
            quizIds: [7]
          },
          {
            id: 6,
            name: 'Definite Integrals',
            type: 'lesson',
            description: 'Understand definite integrals and their applications',
            slides: [
              {
                title: 'The Definite Integral',
                content: 'A definite integral represents the area under a curve between two points.',
                examples: [
                  '∫[a to b] f(x) dx = F(b) - F(a)',
                  'Area under curve = ∫[a to b] f(x) dx'
                ]
              }
            ],
            quizIds: [8]
          }
        ]
      },
      {
        name: 'Taylor Series',
        type: 'section',
        description: 'Explore power series representations of functions',
        children: [
          {
            id: 7,
            name: 'Introduction to Taylor Series',
            type: 'lesson',
            description: 'Learn how to represent functions as infinite series',
            slides: [
              {
                title: 'What is a Taylor Series?',
                content: 'A Taylor series is an infinite sum of terms that are calculated from the derivatives of a function at a single point.',
                examples: [
                  'e^x = 1 + x + x²/2! + x³/3! + ...',
                  'sin(x) = x - x³/3! + x⁵/5! - ...'
                ]
              }
            ],
            quizIds: [11]
          },
          {
            id: 8,
            name: 'Convergence of Series',
            type: 'lesson',
            description: 'Understand when and where series converge',
            slides: [
              {
                title: 'Series Convergence',
                content: 'Learn various tests to determine if a series converges or diverges.',
                examples: [
                  'Ratio Test',
                  'Root Test',
                  'Comparison Tests'
                ]
              }
            ],
            quizIds: [12]
          }
        ]
      },
      {
        name: "Newton's Method",
        type: 'section',
        description: 'Learn numerical methods for finding roots',
        children: [
          {
            id: 9,
            name: "Introduction to Newton's Method",
            type: 'lesson',
            description: 'Understand how to approximate roots of functions',
            slides: [
              {
                title: "What is Newton's Method?",
                content: "Newton's method is an iterative technique for finding roots of equations using derivatives.",
                examples: [
                  'x_(n+1) = x_n - f(x_n)/f\'(x_n)',
                  'Example: Finding √2 using Newton\'s method'
                ]
              }
            ],
            quizIds: [9]
          },
          {
            id: 10,
            name: 'Applications and Limitations',
            type: 'lesson',
            description: 'Explore where Newton\'s method works best',
            slides: [
              {
                title: 'When to Use Newton\'s Method',
                content: 'Learn about convergence conditions and potential pitfalls.',
                examples: [
                  'Multiple roots',
                  'Cases where the method fails'
                ]
              }
            ],
            quizIds: [10]
          }
        ]
      },
      {
        name: 'Fundamental Theorem of Calculus',
        type: 'section',
        description: 'Connect differentiation and integration',
        children: [
          {
            id: 11,
            name: 'Part I: Antiderivatives',
            type: 'lesson',
            description: 'Understand the first part of the theorem',
            slides: [
              {
                title: 'The First Fundamental Theorem',
                content: 'Learn how the derivative of an integral yields the original function.',
                examples: [
                  'd/dx[∫[a to x] f(t)dt] = f(x)',
                  'Applications in physics and engineering'
                ]
              }
            ],
            quizIds: [7, 8]
          },
          {
            id: 12,
            name: 'Part II: Evaluation',
            type: 'lesson',
            description: 'Master the second part of the theorem',
            slides: [
              {
                title: 'The Second Fundamental Theorem',
                content: 'Learn how to evaluate definite integrals using antiderivatives.',
                examples: [
                  '∫[a to b] f(x)dx = F(b) - F(a)',
                  'Connection to area under curves'
                ]
              }
            ],
            quizIds: [7, 8]
          }
        ]
      }
    ];
    this.dataSource.data = TREE_DATA;
  }

  ngOnInit() {
    // Ensure all nodes start collapsed
    this.treeControl.collapseAll();
  }

  hasChild = (_: number, node: LessonNode) => node.type === 'section' && !!node.children && node.children.length > 0;

  selectLesson(node: LessonNode) {
    if (node.type === 'lesson') {
      this.selectedLesson = node;
      this.currentSlideIndex = 0; // Reset to first slide when selecting a new lesson
    }
  }

  get currentSlide(): Slide | null {
    if (!this.selectedLesson?.slides) return null;
    return this.selectedLesson.slides[this.currentSlideIndex];
  }

  nextSlide() {
    if (this.selectedLesson?.slides && 
        this.currentSlideIndex < this.selectedLesson.slides.length - 1) {
      this.currentSlideIndex++;
    }
  }

  previousSlide() {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
    }
  }

  startQuiz() {
    if (this.selectedLesson?.quizIds) {
      this.router.navigate(['/quiz'], {
        queryParams: {
          quizIds: this.selectedLesson.quizIds.join(','),
          lessonId: this.selectedLesson.id
        }
      });
    }
  }
} 