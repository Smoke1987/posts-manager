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
      });
    } else {
      return [];
    }
  }
);

// Filtering selector
export const selectVisiblePostsByUserId = (userId: number) => createSelector(
  selectVisiblePosts,
  (visiblePosts) => visiblePosts.filter(_post => _post.userId === userId)
);

// Универсальный селектор для уникальных значений любого поля
export const selectUniquePostValues = <T extends keyof IPost>(field: T) =>
  createSelector(selectVisiblePosts, (posts): IPost[T][] => {
    if (!posts || posts.length === 0) return [];

    const values = posts.map(_post => _post[field]);

    // Для массивов (например, tags) делаем flat
    if (Array.isArray(values[0])) {
      const flatValues = values.flat() as unknown[];
      return [...new Set(flatValues)] as IPost[T][];
    }

    return [...new Set(values)].filter(value =>
      value !== null && value !== undefined && value !== ''
    ) as IPost[T][];
  });
