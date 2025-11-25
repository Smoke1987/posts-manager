import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';

import { firstValueFrom } from 'rxjs';

import { AuthService } from '../services/auth/auth.service';
import { AppModalsService } from '../services/modals/app-modals.service';
import { AppModalConfig } from '../services/modals/app-modals.model';

export const authGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);

  let isLogged = authService?.isAuthenticated;

  if (!isLogged) {
    const modalsService = inject(AppModalsService);

    const { LoginFormComponent } = await import('../modals/login-form/login-form.component');

    // Модальное окно авторизации невозможно закрыть пока юзер не авторизовался
    const modalConfig: AppModalConfig = { disableClose: true };

    isLogged = !!(await firstValueFrom(modalsService.openModal<boolean>(LoginFormComponent, undefined, modalConfig)));
  }

  return isLogged;
};
