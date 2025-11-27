import { createSelector } from '@ngrx/store';

import { loggedUser } from './users.selector';

import { AppState } from '../../models/store.model';
import { IUser } from '../../models/users.model';
import { IPost } from '../../models/posts.model';

export const selectAllPosts = (state: AppState) => state.postsData?.posts || [];

export const selectVisiblePosts = createSelector(
  loggedUser,
  selectAllPosts,
  (loggedUser: IUser | null, allPosts: IPost[]) => {
    if (loggedUser && allPosts) {
      return allPosts.filter((post) => {
        if (loggedUser.role === 'admin') {
          return post;
        }

        return post.id % 2 === 0;
      }).map((post) => {
        if (loggedUser.role === 'user') {
          const { title } = post;
          return { title };
        }
        return post;
      });
    } else {
      return [];
    }
  }
);
