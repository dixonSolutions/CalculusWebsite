import { Injectable } from '@angular/core';

declare global {
  interface Window {
    posthog: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class PosthogService {
  constructor() {}

  private get posthog() {
    return window.posthog;
  }

  /**
   * Capture a custom event
   * @param eventName Name of the event
   * @param properties Optional properties to include with the event
   */
  capture(eventName: string, properties?: Record<string, any>) {
    if (this.posthog) {
      this.posthog.capture(eventName, properties);
    }
  }

  /**
   * Identify a user
   * @param distinctId Unique identifier for the user
   * @param properties Optional user properties
   */
  identify(distinctId: string, properties?: Record<string, any>) {
    if (this.posthog) {
      this.posthog.identify(distinctId, properties);
    }
  }

  /**
   * Reset the current user
   */
  reset() {
    if (this.posthog) {
      this.posthog.reset();
    }
  }

  /**
   * Register properties that will be sent with all subsequent events
   * @param properties Properties to register
   * @param once Only register the properties if they haven't been registered before
   */
  register(properties: Record<string, any>, once = false) {
    if (this.posthog) {
      if (once) {
        this.posthog.register_once(properties);
      } else {
        this.posthog.register(properties);
      }
    }
  }

  /**
   * Check if PostHog is loaded and available
   */
  isLoaded(): boolean {
    return !!this.posthog;
  }
} 