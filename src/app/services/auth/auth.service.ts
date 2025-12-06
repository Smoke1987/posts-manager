import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { APP_CONFIG } from '../../app-config';

import { IAuthData, IAuthResult } from '../../models/common.model';
import { userLogIn, userLogOut } from '../../state/actions/users.actions';
import { IUser } from '../../models/users.model';
import { SessionStorageService } from '../session-storage/session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  appConfig = inject(APP_CONFIG);
  store = inject(Store);
  sessionStorage =  inject(SessionStorageService);

  private _isAuthenticated: boolean | undefined;

  set isAuthenticated(state: boolean) {
    this._isAuthenticated = state;
  }

  get isAuthenticated(): boolean | undefined {
    return this._isAuthenticated;
  }

  async authenticate(loginData: Partial<IAuthData>): Promise<IAuthResult> {
    const fallbackResult: IAuthResult = {
      success: false,
      error: { errorCode: -1, errorText: 'Непредвиденная ошибка. Повторите попытку позже.' },
    };

    try {
      const userExists = (this.appConfig.users || []).find(
        (_user) => _user.login === loginData.login && _user.password === loginData.password
      );

      if (!userExists) {
        return { success: false, error: { errorText: 'Неверные реквизиты входа' } };
      }

      this.sessionStorage.setItem('userData', JSON.stringify(userExists));

      this.userLogin(userExists);

      return { success: true };
    } catch (e) {
      // Handle exceptions
    }

    return fallbackResult;
  }

  userLogin(user: IUser): void {
    this.store.dispatch(userLogIn({ user }));
    this.isAuthenticated = true;
  }

  userLogout(): void {
    this.store.dispatch(userLogOut());
    this.sessionStorage.removeItem('userData');
    this.isAuthenticated = false;
    // Принудительная навигация с повторной проверкой guards
    window.location.reload();
  }

  /**
   * Функция проверяет, был ли авторизован пользователь в рамках текущей сессии браузера <br/>
   * <b style="color: red;">ВАЖНО!!!</b>
   * В текущей реализации не проверяются учётные данные пользователя
   */
  checkUserLogged(): boolean {
    let user: IUser;
    try {
      const userJson = this.sessionStorage.getItem('userData');
      user = userJson ? JSON.parse(userJson) : null;

      if (user) {
        this.userLogin(user);
        return true;
      }
    } catch (e) {
      // Handle
    }

    return false;
  }
}
