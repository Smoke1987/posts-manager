import { createAction, props } from '@ngrx/store';
import { PostsState } from '../../models/store.model';
import { IPost } from '../../models/posts.model';

export const postsLoaded = createAction(
  '[Posts] Loaded',
  props<PostsState>(),
);

export const updatePostById = createAction(
  '[Posts] Update Post By Id',
  props<{ id: number; updates: Partial<IPost> }>()
);
