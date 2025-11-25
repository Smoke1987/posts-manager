import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isAuthenticated = false;

  set isAuthenticated(state: boolean) {
    this._isAuthenticated = state;
  }

  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }
}
