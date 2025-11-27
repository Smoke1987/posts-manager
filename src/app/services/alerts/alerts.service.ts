import { Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { AppModalsService } from '../modals/app-modals.service';
import { AppErrorAlertData } from './alerts.model';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  defaultError = 'Что-то пошло не так. Повторите попытку позже';

  constructor(
    private modalsService: AppModalsService,
  ) {}

  async showErrorAlert(errorText: string = this.defaultError): Promise<void> {
    const { ErrorAlertComponent } = await import('../../modals/error-alert/error-alert.component');
    await firstValueFrom(
      this.modalsService.openModal<unknown, AppErrorAlertData>(ErrorAlertComponent, { errorText }, {})
    );
  }
}
