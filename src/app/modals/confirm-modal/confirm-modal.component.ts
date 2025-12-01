import { AfterViewInit, Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

import { AppModalsService } from '../../services/modals/app-modals.service';
import { AppConfirmModalData } from '../../services/modals/app-modals.model';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    NgIf
  ],
})
export class ConfirmModalComponent implements AfterViewInit {
  title = '';
  text = '';
  okBtnText = '';
  cancelBtnText = '';
  autoCloseTimeout = -1;

  constructor(
    private modalsService: AppModalsService,
    @Inject(MAT_DIALOG_DATA) public data: AppConfirmModalData,
  ) {
    this.title = data.title ?? 'Подтвердите действие';
    this.text = data.text ?? '';
    this.okBtnText = data.okBtnText ?? 'OK';
    this.cancelBtnText = data.cancelBtnText ?? 'Отмена';

    if (data.autoCloseTimeout) {
      this.autoCloseTimeout = data.autoCloseTimeout;
    }
  }

  ngAfterViewInit(): void {
    if (this.autoCloseTimeout && this.autoCloseTimeout > 0) {
      setTimeout(() => {
        this.close(false);
      }, this.autoCloseTimeout);
    }
  }

  close(confirmed: boolean): void {
    this.modalsService.closeModal(this.data.modalId || '', confirmed);
  }
}
