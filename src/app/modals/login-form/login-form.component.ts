import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule, MatLabel } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { LoginForm } from '../../models/common.model';
import { AuthService } from '../../services/auth/auth.service';
import { AlertsService } from '../../services/alerts/alerts.service';
import { AppModalsService } from '../../services/modals/app-modals.service';
import { AppModalData } from '../../services/modals/app-modals.model';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatLabel,
    MatDialogModule,
    NgIf
  ],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  loginForm: FormGroup<LoginForm>;
  hidePassword = true;

  pendingLogin = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertsService: AlertsService,
    private modalsService: AppModalsService,
    @Inject(MAT_DIALOG_DATA) public data: AppModalData,
  ) {
    this.loginForm = new FormGroup<LoginForm>({
      login: this.fb.nonNullable.control({ value: '', disabled: false }, Validators.required),
      password: this.fb.nonNullable.control({ value: '', disabled: false }, Validators.required),
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      return;
    }

    if (this.pendingLogin) {
      return;
    }

    const authResult = await this.authService.authenticate({ ...this.loginForm.value });
    if (!authResult?.success) {
      this.alertsService.showErrorAlert(authResult?.error?.errorText);
      return;
    }

    // Success auth
    this.modalsService.closeModal<boolean>(this.data.modalId || '', true);
  }
}
