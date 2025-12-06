import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { AppModalsService } from '../../services/modals/app-modals.service';
import { AppErrorAlertData } from '../../services/alerts/alerts.model';

@Component({
  selector: 'app-error-alert',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogModule,
  ],
  templateUrl: './error-alert.component.html',
  styleUrl: './error-alert.component.scss'
})
export class ErrorAlertComponent {
  constructor(
    private modalsService: AppModalsService,
    @Inject(MAT_DIALOG_DATA) public data: AppErrorAlertData,
  ) {}

  onCloseClicked(): void {
    this.modalsService.closeModal(this.data.modalId || '');
  }
}
