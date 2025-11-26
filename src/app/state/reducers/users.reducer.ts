import { createReducer, on } from '@ngrx/store';

import * as UsersActions from '../actions/users.actions';
import { UserState } from '../../models/store.model';

export const usersFeatureKey = 'userData';

const initialState: UserState = {
  user: null,
};

export const usersReducer = createReducer(
  initialState,
  on(UsersActions.userLogIn, (state, { user }) => ({ ...state, user })),
  on(UsersActions.userLogOut, (state) => ({ user: null })),
);
