import { createReducer, on } from '@ngrx/store';

import { PostsState } from '../../models/store.model';
import * as PostsActions from '../actions/posts.actions';

export const postsFeatureKey = 'postsData';

const initialState: PostsState = {
  posts: [],
};

export const postsReducer = createReducer(
  initialState,
  on(PostsActions.postsLoaded, (state, { posts }) => ({ ...state, posts })),
  on(PostsActions.updatePostById, (state, { id, updates }) => ({
    ...state,
    posts: (state.posts || []).map(post =>
      post.id === id ? { ...post, ...updates } : post
    ),
  }))
);
