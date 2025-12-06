import { Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { NgForOf, NgIf } from '@angular/common';

import { combineLatest } from 'rxjs';

import { UsersService } from '../../services/users/users.service';
import { PostsService } from '../../services/posts/posts.service';
import { DisplayFieldName, IPost } from '../../models/posts.model';
import { AppHeaderComponent } from '../../components/app-header/app-header.component';
import {
  displayFieldLabels,
  displayFieldLabelsShort,
  userRoleMainDisplayFields
} from '../../services/posts/posts.helper';
import { AppLoaderComponent } from '../../components/app-loader/app-loader.component';
import { UserRole } from '../../models/users.model';
import { PostsTableComponent } from '../../components/posts-table/posts-table.component';
import {
  ContentWithButtonsLayoutComponent
} from '../../layouts/content-with-buttons-layout/content-with-buttons-layout.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    AppHeaderComponent,
    MatButton,
    NgForOf,
    AppLoaderComponent,
    NgIf,
    PostsTableComponent,
    MatButtonModule,
    ContentWithButtonsLayoutComponent,
  ],
})
export class HomePageComponent implements OnInit {
  usersService = inject(UsersService);
  postsService = inject(PostsService);
  router = inject(Router);

  userRole: UserRole | null = null;
  displayedColumns: DisplayFieldName[] = [];
  displayFieldLabels = displayFieldLabels;
  displayFieldLabelsShort = displayFieldLabelsShort;
  dataSource = new MatTableDataSource<IPost>([]);
  dataLoading = true;

  async ngOnInit(): Promise<void> {
    await this.postsService.postsLoadedPromise;

    combineLatest([
      this.usersService.user$,
      this.postsService.userPosts$,
    ]).subscribe({
      next: async ([user, posts]) => {
        this.userRole = await this.usersService.getUserRole();
        if (this.userRole) {
          this.displayedColumns = userRoleMainDisplayFields[this.userRole];
        } else {
          // TODO: нужно ли добавлять обработку когда у юзера нет UserRole
        }

        this.dataSource.data = posts;
        this.dataLoading = false;
      },
      error: () => {
        this.dataLoading = false;
        // TODO: что должно происходить при ошибке загрузки данных
      },
    });
  }

  async refreshData(): Promise<void> {
    this.dataLoading = true;
    await this.postsService.loadPosts();
    this.dataLoading = false;
  }

  goToDetails(post: IPost): any {
    this.router.navigate([`/details/${post.userId}`]);
  }
}
