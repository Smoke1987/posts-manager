import { InjectionToken } from '@angular/core';

import { AppConfig } from './models/common.model';

// Globally available configuration using providedIn
export const APP_CONFIG = new InjectionToken<AppConfig>('app.config', {
  providedIn: 'root',
  factory: () => ({
    apiUrl: 'http://jsonplaceholder.typicode.com',
    users: [
      { login: 'user', password: 'user', role: 'user' },
      { login: 'admin', password: 'admin', role: 'admin' },
    ],
  })
});

export const SESSION_STORAGE = new InjectionToken<Storage>('Session storage', {
  providedIn: 'root',
  factory: () => window.sessionStorage
});
