import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private deferredPrompt: any;
  private installable = new BehaviorSubject<boolean>(false);

  constructor() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.installable.next(true);
    });

    window.addEventListener('appinstalled', () => {
      this.installable.next(false);
      this.deferredPrompt = null;
    });
  }

  get installable$() {
    return this.installable.asObservable();
  }

  async install() {
    if (!this.deferredPrompt) {
      return;
    }

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      this.installable.next(false);
    }
    
    this.deferredPrompt = null;
  }
} 