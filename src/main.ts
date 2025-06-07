import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import posthog from 'posthog-js';
import { environment } from './environments/environment';

// Initialize PostHog
posthog.init(
  environment.posthog.apiKey,
  {
    api_host: environment.posthog.apiHost,
    person_profiles: 'identified_only',
    loaded: (posthog) => {
      if (!environment.production) {
        // In development, log PostHog events to console
        posthog.debug();
      }
    }
  }
);

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
