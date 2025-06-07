import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { LessonsComponent } from './lessons/lessons.component';
import { PracticeComponent } from './practice/practice.component';
import { QuizComponent } from './quiz/quiz.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'lessons', component: LessonsComponent },
  { path: 'practice', component: PracticeComponent },
  { path: 'quiz', component: QuizComponent },
  { path: '**', redirectTo: 'home' }
]; 