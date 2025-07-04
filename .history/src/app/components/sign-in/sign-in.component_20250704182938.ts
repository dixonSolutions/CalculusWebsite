import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {
  loading = false;
  emailSent = false;
  errorMessage = '';

  signInForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(
    private readonly supabase: SupabaseService,
    private readonly formBuilder: FormBuilder
  ) {}

  async onSubmit(): Promise<void> {
    if (this.signInForm.invalid) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    try {
      this.loading = true;
      this.errorMessage = '';
      
      // Disable the form while loading
      this.signInForm.disable();
      
      const email = this.signInForm.value.email as string;
      
      const { error } = await this.supabase.signIn(email);
      
      if (error) throw error;
      
      this.emailSent = true;
      console.log('Magic link sent successfully to:', email);
    } catch (error) {
      if (error instanceof Error) {
        this.errorMessage = error.message;
        console.error('Sign in error:', error);
      }
    } finally {
      this.loading = false;
      
      // Re-enable the form
      if (!this.emailSent) {
        this.signInForm.enable();
      }
    }
  }

  resetForm() {
    this.emailSent = false;
    this.errorMessage = '';
    this.signInForm.reset();
    this.signInForm.enable();
  }

  // Getter to check if form should be disabled
  get isFormDisabled(): boolean {
    return this.loading || this.emailSent;
  }
} 