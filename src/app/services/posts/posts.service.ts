import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { catchError, firstValueFrom, Observable, of } from 'rxjs';

import { APP_CONFIG } from '../../app-config';

import { IPost } from '../../models/posts.model';
import * as PostsSelectors from '../../state/selectors/posts.selector';
import { postsLoaded } from '../../state/actions/posts.actions';

import postsData from './data.json';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  appConfig = inject(APP_CONFIG);
  httpClient = inject(HttpClient);
  store = inject(Store);

  apiBaseUrl = this.appConfig.apiUrl;

  posts: IPost[] = [];
  selectedPost: IPost | null = null;
  selectedPostElement: HTMLElement | null = null;

  userPosts$ = this.store.select(PostsSelectors.selectVisiblePosts);

  selectedUserPosts$: (userId: number) => Observable<IPost[]> = (userId: number) => {
    return this.store.select(PostsSelectors.selectVisiblePostsByUserId(userId));
  }

  postsLoadedResolver?: () => void;
  postsLoadedPromise = new Promise<void>(resolve => this.postsLoadedResolver = resolve);

  async loadPosts(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.httpClient.get<IPost[]>(`${this.apiBaseUrl}/posts`)
      // of(postsData as IPost[])
        .pipe(
          catchError((error) => {
            // Fallback data for resource restriction
            return of(postsData as IPost[]);
          }),
        )
        .subscribe({
          next: (posts) => {
            this.posts = (posts || []).map((post) => ({
              ...post,
              count: posts.filter(_ => _.userId === post.userId)?.length
            }));

            this.store.dispatch(postsLoaded({ posts: this.posts }));
            this.postsLoadedResolver?.();
            resolve();
          },
          error: (error) => {
            // Handle error
          }
        });
    });
  }

  async getAllUsersIds(): Promise<number[]> {
    return await firstValueFrom(this.store.select(PostsSelectors.selectUniquePostValues('userId')));
  }

  async getAllPostsIds(): Promise<number[]> {
    return await firstValueFrom(this.store.select(PostsSelectors.selectUniquePostValues('id')));
  }

  async findFirstAvailablePostIds(): Promise<number> {
    const allPostsIds = await this.getAllPostsIds();
    if (!allPostsIds.length) return 1;

    // Сортируем массив для последовательной проверки
    const sorted = [...allPostsIds].sort((a, b) => a - b);

    // Ищем первое пропущенное число
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i] !== i + 1) {
        return i + 1;
      }
    }

    // Если все числа последовательны, возвращаем следующее
    return sorted.length + 1;
  }

  async checkAvailablePostId(postId: number | string): Promise<boolean> {
    const allPostsIds = await this.getAllPostsIds();
    if (typeof postId === 'string') {
      postId = parseInt(postId, 10);
    }
    return !allPostsIds.includes(postId);
  }

}
