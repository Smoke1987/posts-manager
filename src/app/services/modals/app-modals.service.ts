import { Injectable } from '@angular/core';
import { Dialog, DialogConfig, DialogRef } from '@angular/cdk/dialog';
import { ComponentType } from '@angular/cdk/overlay';

import { firstValueFrom, map, Observable } from 'rxjs';

import { AppConfirmModalData, AppModalConfig, AppModalData } from './app-modals.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';

@Injectable({
  providedIn: 'root'
})
export class AppModalsService {
  constructor(
    private dialog: Dialog,
  ) {
  }

  async showConfirmModal(data: AppConfirmModalData = {}): Promise<boolean> {
    const { ConfirmModalComponent } = await import('../../modals/confirm-modal/confirm-modal.component');
    const confirmed = await firstValueFrom(
      this.openModal<boolean, AppConfirmModalData>(ConfirmModalComponent, data, {})
    );

    return !!confirmed;
  }

  openModal<
    TResult = unknown,
    TData extends AppModalData = AppModalData,
    TComponent = unknown,
  >(
    component: ComponentType<TComponent>,
    data?: TData,
    config: AppModalConfig = {},
  ): Observable<TResult | undefined> {

    const modalId = data?.modalId || config.id || `dialog_${Math.round(Math.random() * 1000000) + 1}`;
    config.id = modalId;

    data = { ...data, modalId } as TData;

    const dialogConfig: DialogConfig<TData, DialogRef<TResult, TComponent>> = {
      data,
      id: modalId,
      ...config,
    };

    dialogConfig.providers = [
      { provide: MAT_DIALOG_DATA, useValue: data },
    ];

    if (dialogConfig.panelClass) {
      if (!Array.isArray(dialogConfig.panelClass)) {
        dialogConfig.panelClass = dialogConfig.panelClass.split(' ');
      }
      dialogConfig.panelClass = [...dialogConfig.panelClass, 'app-modal'];
    } else {
      dialogConfig.panelClass = ['app-modal'];
    }

    const modalRef = this.dialog.open<TResult, TData, TComponent>(component, {
      width: 'var(--modal-width)',
      height: 'var(--modal-height)',
      ...dialogConfig,
    });

    return modalRef.closed.pipe(
      map((modalResult) => {
        // FIXME:: for develop
        console.log('The modal was closed', { component, modalResult });
        return modalResult;
      }),
    );
  }

  closeModal<TResult = unknown>(modalId: string, result?: TResult): void {
    this.dialog.openDialogs.find((_ref) => _ref.id === modalId)?.close(result);
  }
}
