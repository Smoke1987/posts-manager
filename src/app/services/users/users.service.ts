import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { firstValueFrom } from 'rxjs';

import * as UsersSelectors from '../../state/selectors/users.selector';
import { UserRole } from '../../models/users.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  store = inject(Store);

  user$ = this.store.select(UsersSelectors.loggedUser);

  async getUserRole(): Promise<UserRole | null> {
    const user = await firstValueFrom(this.user$);
    return user ? user.role : null;
  }
}
