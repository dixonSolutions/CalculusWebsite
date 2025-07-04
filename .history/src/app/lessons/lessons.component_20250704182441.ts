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
    // No hardcoded data - if database fails, show empty state
    this.dataSource.data = [];
    console.log('Database unavailable, showing empty state');
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