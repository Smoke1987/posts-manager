import { IUser } from './users.model';
import { IPost } from './posts.model';

export type UserState = { user: IUser | null };

export type PostsState = { posts: IPost[] | null };

export type AppState = {
  userData: UserState;
  postsData: PostsState;
};
