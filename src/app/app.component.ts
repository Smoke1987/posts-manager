import { AfterViewInit, Component, inject } from '@angular/core';

import { PostsService } from './services/posts/posts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  postsService = inject(PostsService);

  title = 'posts-manager';

  ngAfterViewInit(): void {
    this.postsService.loadPosts();
  }
}
