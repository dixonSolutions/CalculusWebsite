import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface SMSRequest {
  phone: string;
  message: string;
}

export interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface OTPRecord {
  phone: string;
  code: string;
  attempts: number;
  expiresAt: Date;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class SmsService {
  private readonly CLICKSEND_URL = 'https://rest.clicksend.com/v3/sms/send';
  private readonly USERNAME = 'andrzej.butrym75@gmail.com';
  private readonly API_KEY = 'A16AED08-E89D-2E73-34DF-D6C170D95BAA';
  private readonly MAX_ATTEMPTS = 5;
  private readonly OTP_EXPIRY_MINUTES = 10;
  
  // In-memory storage for OTP records (in production, use database)
  private otpRecords = new Map<string, OTPRecord>();

  constructor(private http: HttpClient) {}

  /**
   * Generate a 6-digit OTP code
   */
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Clean expired OTP records
   */
  private cleanExpiredRecords(): void {
    const now = new Date();
    for (const [phone, record] of this.otpRecords.entries()) {
      if (record.expiresAt < now) {
        this.otpRecords.delete(phone);
      }
    }
  }

  /**
   * Check if phone number has reached rate limit
   */
  private isRateLimited(phone: string): boolean {
    this.cleanExpiredRecords();
    const record = this.otpRecords.get(phone);
    return record ? record.attempts >= this.MAX_ATTEMPTS : false;
  }

  /**
   * Get remaining attempts for a phone number
   */
  getRemainingAttempts(phone: string): number {
    this.cleanExpiredRecords();
    const record = this.otpRecords.get(phone);
    return record ? Math.max(0, this.MAX_ATTEMPTS - record.attempts) : this.MAX_ATTEMPTS;
  }

  /**
   * Send OTP via ClickSend SMS
   */
  async sendOTP(phone: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Clean expired records first
      this.cleanExpiredRecords();

      // Check rate limiting
      if (this.isRateLimited(phone)) {
        return {
          success: false,
          error: `Too many attempts. Please try again later. You have used all ${this.MAX_ATTEMPTS} attempts.`
        };
      }

      // Generate OTP
      const code = this.generateOTP();
      const message = `Your Master Calculus verification code is: ${code}. This code expires in ${this.OTP_EXPIRY_MINUTES} minutes.`;

      // Prepare ClickSend API request
      const payload = {
        messages: [
          {
            to: phone,
            body: message,
            from: 'MasterCalc'
          }
        ]
      };

      const headers = new HttpHeaders({
        'Authorization': 'Basic ' + btoa(`${this.USERNAME}:${this.API_KEY}`),
        'Content-Type': 'application/json'
      });

      // Send SMS via ClickSend
      const response = await this.http.post<any>(this.CLICKSEND_URL, payload, { headers }).toPromise();

      if (response && response.http_code === 200) {
        // Store OTP record
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + this.OTP_EXPIRY_MINUTES);

        const existingRecord = this.otpRecords.get(phone);
        const attempts = existingRecord ? existingRecord.attempts + 1 : 1;

        this.otpRecords.set(phone, {
          phone,
          code,
          attempts,
          expiresAt,
          createdAt: new Date()
        });

        console.log(`OTP sent to ${phone}. Attempts: ${attempts}/${this.MAX_ATTEMPTS}`);
        return { success: true };
      } else {
        throw new Error(response?.response_msg || 'Failed to send SMS');
      }
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      return {
        success: false,
        error: error.message || 'Failed to send verification code'
      };
    }
  }

  /**
   * Verify OTP code
   */
  verifyOTP(phone: string, code: string): { success: boolean; error?: string } {
    this.cleanExpiredRecords();
    
    const record = this.otpRecords.get(phone);
    
    if (!record) {
      return {
        success: false,
        error: 'No verification code found for this phone number'
      };
    }

    if (record.expiresAt < new Date()) {
      this.otpRecords.delete(phone);
      return {
        success: false,
        error: 'Verification code has expired'
      };
    }

    if (record.code !== code) {
      return {
        success: false,
        error: 'Invalid verification code'
      };
    }

    // OTP verified successfully, remove the record
    this.otpRecords.delete(phone);
    console.log(`OTP verified successfully for ${phone}`);
    
    return { success: true };
  }

  /**
   * Reset attempts for a phone number (for testing or admin purposes)
   */
  resetAttempts(phone: string): void {
    this.otpRecords.delete(phone);
    console.log(`Reset attempts for ${phone}`);
  }

  /**
   * Get time until rate limit resets
   */
  getTimeUntilReset(phone: string): number {
    const record = this.otpRecords.get(phone);
    if (!record) return 0;
    
    const timeUntilExpiry = record.expiresAt.getTime() - new Date().getTime();
    return Math.max(0, timeUntilExpiry);
  }
} 