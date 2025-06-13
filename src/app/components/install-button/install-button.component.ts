import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PwaService } from '../../services/pwa.service';

@Component({
  selector: 'app-install-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <button *ngIf="installable$ | async"
            mat-raised-button
            color="primary"
            (click)="install()"
            class="install-button">
      <mat-icon>download</mat-icon>
      Install App
    </button>
  `,
  styles: [`
    .install-button {
      margin: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class InstallButtonComponent implements OnInit {
  installable$ = this.pwaService.installable$;

  constructor(private pwaService: PwaService) {}

  ngOnInit(): void {}

  install() {
    this.pwaService.install();
  }
} 