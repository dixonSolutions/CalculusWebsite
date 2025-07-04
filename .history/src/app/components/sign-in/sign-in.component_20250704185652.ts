import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';
import { SmsService } from '../../services/sms.service';

export type AuthMethod = 'email' | 'phone';

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
  otpSent = false;
  errorMessage = '';
  currentMethod: AuthMethod = 'email';
  awaitingOtpVerification = false;

  // Email form
  signInForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  // Phone form
  phoneForm = this.formBuilder.group({
    phone: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
  });

  // OTP verification form
  otpForm = this.formBuilder.group({
    otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  constructor(
    private readonly supabase: SupabaseService,
    private readonly smsService: SmsService,
    private readonly formBuilder: FormBuilder
  ) {}

  switchMethod(method: AuthMethod) {
    this.currentMethod = method;
    this.resetAllForms();
  }

  async onEmailSubmit(): Promise<void> {
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

  async onPhoneSubmit(): Promise<void> {
    if (this.phoneForm.invalid) {
      this.errorMessage = 'Please enter a valid phone number with country code (e.g., +1234567890).';
      return;
    }

    try {
      this.loading = true;
      this.errorMessage = '';
      
      // Disable the form while loading
      this.phoneForm.disable();
      
      const phone = this.phoneForm.value.phone as string;
      
      // Check remaining attempts
      const remainingAttempts = this.smsService.getRemainingAttempts(phone);
      if (remainingAttempts === 0) {
        throw new Error('Too many attempts. Please try again later.');
      }

      const result = await this.smsService.sendOTP(phone);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to send verification code');
      }
      
      this.otpSent = true;
      this.awaitingOtpVerification = true;
      console.log('OTP sent successfully to:', phone);
      console.log(`Remaining attempts: ${remainingAttempts - 1}/5`);
      
    } catch (error) {
      if (error instanceof Error) {
        this.errorMessage = error.message;
        console.error('Phone auth error:', error);
      }
    } finally {
      this.loading = false;
      
      // Re-enable the form
      if (!this.otpSent) {
        this.phoneForm.enable();
      }
    }
  }

  async onOtpSubmit(): Promise<void> {
    if (this.otpForm.invalid) {
      this.errorMessage = 'Please enter a valid 6-digit verification code.';
      return;
    }

    try {
      this.loading = true;
      this.errorMessage = '';
      
      const phone = this.phoneForm.value.phone as string;
      const otp = this.otpForm.value.otp as string;
      
      // Verify SMS code first
      const result = this.smsService.verifyOTP(phone, otp);
      
      if (!result.success) {
        throw new Error(result.error || 'Invalid verification code');
      }

      console.log('SMS verification successful, creating Supabase session...');
      
      // Create Supabase session after successful SMS verification
      const authResult = await this.supabase.authenticatePhone(phone);
      
      if (authResult.success) {
        console.log('Phone authentication successful, redirecting...');
        // User will be redirected in the authenticatePhone method
      } else {
        console.error('Failed to create Supabase session:', authResult.error);
        throw new Error('Verification successful but failed to create session. Please try again.');
      }
      
    } catch (error) {
      if (error instanceof Error) {
        this.errorMessage = error.message;
        console.error('OTP verification error:', error);
      }
      // Don't reset form if there was a session creation error - let user try again
      if (!(error instanceof Error && error.message?.includes('create session'))) {
        this.otpForm.reset();
      }
    } finally {
      this.loading = false;
    }
  }

  resetAllForms() {
    this.emailSent = false;
    this.otpSent = false;
    this.awaitingOtpVerification = false;
    this.errorMessage = '';
    
    this.signInForm.reset();
    this.phoneForm.reset();
    this.otpForm.reset();
    
    this.signInForm.enable();
    this.phoneForm.enable();
    this.otpForm.enable();
  }

  resetEmailForm() {
    this.emailSent = false;
    this.errorMessage = '';
    this.signInForm.reset();
    this.signInForm.enable();
  }

  resetPhoneForm() {
    this.otpSent = false;
    this.awaitingOtpVerification = false;
    this.errorMessage = '';
    this.phoneForm.reset();
    this.otpForm.reset();
    this.phoneForm.enable();
    this.otpForm.enable();
  }

  // Getters for form state
  get isEmailFormDisabled(): boolean {
    return this.loading || this.emailSent;
  }

  get isPhoneFormDisabled(): boolean {
    return this.loading || this.otpSent;
  }

  get isOtpFormDisabled(): boolean {
    return this.loading;
  }

  // Get remaining attempts for current phone number
  get remainingAttempts(): number {
    const phone = this.phoneForm.value.phone;
    return phone ? this.smsService.getRemainingAttempts(phone) : 5;
  }
} 