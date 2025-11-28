import { inject, Injectable } from '@angular/core';
import { APP_CONFIG } from '../../app-config';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { catchError, of } from 'rxjs';

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

  userPosts$ = this.store.select(PostsSelectors.selectVisiblePosts);

  postsLoadedResolver?: () => void;
  postsLoadedPromise = new Promise<void>(resolve => this.postsLoadedResolver = resolve);

  async loadPosts(): Promise<void> {
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
          this.posts = (posts || []).map((post) => {
            post.count = posts.filter(_ => _.userId === post.userId)?.length;
            return post;
          });

          this.store.dispatch(postsLoaded({ posts: this.posts }));
          this.postsLoadedResolver?.();
        },
        error: (error) => {
          // Handle error
        }
      });
  }
}
