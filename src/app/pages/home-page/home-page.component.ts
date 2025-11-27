import { Component, inject, OnInit } from '@angular/core';

import { UsersService } from '../../services/users/users.service';
import { AuthService } from '../../services/auth/auth.service';
import { PostsService } from '../../services/posts/posts.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {
  usersService = inject(UsersService);
  authService = inject(AuthService);
  postsService = inject(PostsService);

  ngOnInit(): void {
    console.log('HomePageComponent @ ngOnInit():: ', { _this: this });
    this.usersService.user$.subscribe({
      next: (newUser) => {
        console.log('HomePageComponent @ ngOnInit():: user$', { newUser, _this: this });
      },
    });
    this.postsService.userPosts$.subscribe({
      next: (posts) => {
        console.log('HomePageComponent @ ngOnInit():: userPosts$', { posts, _this: this });
      },
    });
  }

  debug(): void {
    console.log('HomePageComponent @ debug():: ', { _this: this });
    this.authService.userLogout();
  }
}
