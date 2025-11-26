import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule, MatLabel } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf } from '@angular/common';

import { LoginForm } from '../../models/common.model';
import { AuthService } from '../../services/auth/auth.service';

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
    NgIf
  ],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  loginForm: FormGroup<LoginForm>;
  hidePassword = true;

  pendingLogin = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {
    this.loginForm = new FormGroup<LoginForm>({
      login: this.fb.nonNullable.control({ value: '', disabled: false }, Validators.required),
      password: this.fb.nonNullable.control({ value: '', disabled: false }, Validators.required),
    });
  }

  ngOnInit(): void {
    console.log('LoginFormComponent @ ngOnInit():: ', { _this: this });
  }

  async onSubmit(): Promise<void> {
    console.log('LoginFormComponent @ onSubmit():: 1', { _this: this });
    if (this.loginForm.invalid) {
      return;
    }

    if (this.pendingLogin) {
      return;
    }

    const authResult = await this.authService.authenticate({ ...this.loginForm.value });
    console.log('LoginFormComponent @ onSubmit():: 2', { authResult, _this: this });
  }
}
