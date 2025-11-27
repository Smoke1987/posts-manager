import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as UsersSelectors from '../../state/selectors/users.selector';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  store = inject(Store);

  user$ = this.store.select(UsersSelectors.loggedUser);
}
