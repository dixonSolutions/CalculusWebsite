import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';
import { SignInComponent } from '../sign-in/sign-in.component';
import { AccountComponent } from '../account/account.component';

@Component({
  selector: 'app-supabase-demo',
  standalone: true,
  imports: [CommonModule, SignInComponent, AccountComponent],
  templateUrl: './supabase-demo.component.html',
  styleUrls: ['./supabase-demo.component.css'],
})
export class SupabaseDemoComponent implements OnInit {
  session = this.supabase.session;
  loading = true;

  constructor(private readonly supabase: SupabaseService) {}

  async ngOnInit() {
    // Get current session
    this.session = await this.supabase.getCurrentSession();
    this.loading = false;

    // Listen for auth changes (this will be handled globally, but we still need to update local state)
    this.supabase.authChanges((event, session) => {
      this.session = session;
    });
  }
} 