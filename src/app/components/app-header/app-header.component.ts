import { Component, inject, input, OnInit, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatLabel, MatSuffix } from '@angular/material/form-field';
import { ActivatedRoute } from '@angular/router';

import { UsersService } from '../../services/users/users.service';
import { AuthService } from '../../services/auth/auth.service';
import { AppModalsService } from '../../services/modals/app-modals.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  standalone: true,
  imports: [
    MatIcon,
    MatButton,
    MatToolbar,
    AsyncPipe,
    NgIf,
    MatLabel,
    MatSuffix,
    MatIconButton
  ],
})
export class AppHeaderComponent implements OnInit {
  title = input.required<string>();
  goBackClicked = output<void>();

  usersService = inject(UsersService);
  modals = inject(AppModalsService);
  authService = inject(AuthService);
  route = inject(ActivatedRoute);

  currentUser$ = this.usersService.user$;

  showBackButton = false;
  logoutConfirmPending = false;

  ngOnInit(): void {
    const snapshotData = this.route.snapshot.data;

    this.showBackButton = !!snapshotData['showBackButton'];
  }

  back(): void {
    this.goBackClicked.emit();
  }

  async logOut(): Promise<void> {
    if (this.logoutConfirmPending) return;

    this.logoutConfirmPending = true;

    const confirmed = await this.modals.showConfirmModal({
      title: '',
      text: 'Вы действительно хотите выйти?',
      okBtnText: 'Да',
      cancelBtnText: 'Нет',
    });

    this.logoutConfirmPending = false;

    confirmed && this.authService.userLogout();
  }
}
