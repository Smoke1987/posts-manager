import { AppState } from '../../models/store.model';

export const loggedUser = (state: AppState) => state.userData?.user || null;
