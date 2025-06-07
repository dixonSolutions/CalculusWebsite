import { Injectable } from '@angular/core';
import posthog from 'posthog-js';

@Injectable({
  providedIn: 'root'
})
export class PosthogService {
  constructor() {}

  /**
   * Capture a custom event
   * @param eventName Name of the event
   * @param properties Optional properties to include with the event
   */
  capture(eventName: string, properties?: Record<string, any>) {
    posthog.capture(eventName, properties);
  }

  /**
   * Identify a user
   * @param distinctId Unique identifier for the user
   * @param properties Optional user properties
   */
  identify(distinctId: string, properties?: Record<string, any>) {
    posthog.identify(distinctId, properties);
  }

  /**
   * Reset the current user
   */
  reset() {
    posthog.reset();
  }

  /**
   * Register properties that will be sent with all subsequent events
   * @param properties Properties to register
   * @param once Only register the properties if they haven't been registered before
   */
  register(properties: Record<string, any>, once = false) {
    if (once) {
      posthog.register_once(properties);
    } else {
      posthog.register(properties);
    }
  }
} 