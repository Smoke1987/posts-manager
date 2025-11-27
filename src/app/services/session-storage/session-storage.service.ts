import { inject, Injectable } from '@angular/core';

import { SESSION_STORAGE } from '../../app-config';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  private sessionStorage = inject(SESSION_STORAGE);

  constructor() { }

  setItem(key: string, value: string): void {
    this.sessionStorage.setItem(key, value);
  }

  getItem(key: string): string | null {
    return this.sessionStorage.getItem(key);
  }

  removeItem(key: string): void {
    this.sessionStorage.removeItem(key);
  }

  clear(): void {
    this.sessionStorage.clear();
  }
}
