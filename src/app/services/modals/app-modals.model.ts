import { DialogConfig } from '@angular/cdk/dialog';

export type AppModalConfig = Omit<DialogConfig, 'data' | 'providers' | 'container'>;

export type AppModalData = {
  modalId?: string;
}

export type AppConfirmModalData = AppModalData & {
  title?: string;
  text?: string;
  okBtnText?: string;
  cancelBtnText?: string;
}
