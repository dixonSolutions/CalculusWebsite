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
import { SupabaseService, LessonNode, Slide } from '../services/supabase.service';

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
  loading = true;
  error: string | null = null;

  constructor(
    private router: Router,
    private supabaseService: SupabaseService
  ) {}

  async ngOnInit() {
    await this.loadLessons();
  }

  private async loadLessons() {
    try {
      this.loading = true;
      this.error = null;
      
      const { data: lessons, error } = await this.supabaseService.getAllLessons();
      
      if (error) {
        console.error('Error loading lessons:', error);
        this.error = 'Failed to load lessons. Please try again later.';
        // Fallback to hardcoded data if database fails
        this.loadFallbackData();
        return;
      }

      if (lessons && lessons.length > 0) {
        this.dataSource.data = lessons;
        console.log('Successfully loaded lessons from database:', lessons.length);
      } else {
        console.warn('No lessons found in database, using fallback data');
        this.loadFallbackData();
      }
    } catch (error) {
      console.error('Exception while loading lessons:', error);
      this.error = 'Failed to load lessons. Please try again later.';
      this.loadFallbackData();
    } finally {
      this.loading = false;
      // Ensure all nodes start collapsed
      this.treeControl.collapseAll();
    }
  }

  private loadFallbackData() {
    // Fallback to original hardcoded data if database is unavailable
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
      }
      // Truncated for brevity - keeping only essential data for fallback
    ];
    
    this.dataSource.data = TREE_DATA;
    console.log('Loaded fallback lesson data');
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

  async refreshLessons() {
    await this.loadLessons();
  }
} 