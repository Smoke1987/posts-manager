import { inject, Injectable } from '@angular/core';
import { APP_CONFIG } from '../../app-config';
import { Store } from '@ngrx/store';
import { IAuthData, IAuthResult } from '../../models/common.model';
import { userLogIn } from '../../state/actions/users.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  appConfig = inject(APP_CONFIG);
  store = inject(Store);

  private _isAuthenticated = false;

  set isAuthenticated(state: boolean) {
    this._isAuthenticated = state;
  }

  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  async authenticate(loginData: Partial<IAuthData>): Promise<IAuthResult> {
    const fallbackResult: IAuthResult = {
      success: false,
      error: { errorCode: -1, errorText: 'Непредвиденная ошибка. Повторите попытку позже.' },
    };

    console.log('AuthService @ authenticate():: ', { loginData, _this: this });

    try {
      const userExists = (this.appConfig.users || []).find(
        (_user) => _user.login === loginData.login && _user.password === loginData.password
      );

      if (!userExists) {
        return { success: false, error: { errorText: 'Неверные реквизиты входа' } };
      }

      this.store.dispatch(userLogIn({ user: userExists }));

      return { success: true };
    } catch (e) {
      // Handle exceptions
    }

    return fallbackResult;
  }
}
