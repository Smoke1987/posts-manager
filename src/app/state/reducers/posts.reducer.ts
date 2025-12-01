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
  })),
  on(PostsActions.removePost, (state, { id }) => ({
    ...state,
    posts: (state.posts || []).filter(post => post.id !== id).map((post) => ({
      ...post,
      count: (state.posts || []).filter(_ => _.userId === post.userId)?.length
    }))
  })),
  on(PostsActions.addPost, (state, { post }) => ({
    ...state,
    posts: [...(state.posts || []), ...(post ? [post] : [])]
      .sort((a, b) => {
        if (a.userId !== b.userId) {
          return a.userId - b.userId;
        }

        return a.id - b.id;
      }).map((post) => ({
        ...post,
        count: (state.posts || []).filter(_ => _.userId === post.userId)?.length
      })),
  })),
);
