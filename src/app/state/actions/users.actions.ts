import { createAction, props } from '@ngrx/store';

import { UserState } from '../../models/store.model';

export const userLogIn = createAction(
  '[User] Login',
  props<UserState>(),
);

export const userLogOut = createAction(
  '[User] Logout',
);
