import { createAction, props } from '@ngrx/store';
import { PostsState } from '../../models/store.model';

export const postsLoaded = createAction(
  '[Posts] Loaded',
  props<PostsState>(),
);
