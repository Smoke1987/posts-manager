import { Injectable } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { ComponentType } from '@angular/cdk/overlay';

import { map, Observable } from 'rxjs';

import { AppModalConfig } from './app-modals.model';

@Injectable({
  providedIn: 'root'
})
export class AppModalsService {
  constructor(
    private dialog: Dialog,
  ) {
  }

  openModal<
    TResult = unknown,
    TData = object,
    TComponent = unknown,
  >(
    component: ComponentType<TComponent>,
    data?: TData,
    config: AppModalConfig = {},
  ): Observable<TResult | undefined> {
    const modalRef = this.dialog.open<TResult, TData, TComponent>(component, {
      width: 'var(--modal-width)',
      height: 'var(--modal-height)',
      data,
      ...config,
    });

    return modalRef.closed.pipe(
      map((modalResult) => {
        // FIXME:: for develop
        console.log('The modal was closed', { modalResult });
        return modalResult;
      }),
    );
  }
}
