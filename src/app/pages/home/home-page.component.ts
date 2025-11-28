import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';

import { combineLatest } from 'rxjs';

import { UsersService } from '../../services/users/users.service';
import { PostsService } from '../../services/posts/posts.service';
import { DisplayFieldName, IPost } from '../../models/posts.model';
import { AppHeaderComponent } from '../../components/app-header/app-header.component';
import { displayFieldLabels, userRoleMainDisplayFields } from '../../services/posts/posts.helper';
import { AppLoaderComponent } from '../../components/app-loader/app-loader.component';
import { UserRole } from '../../models/users.model';

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
    MatSort,
    AsyncPipe,
    NgClass
  ],
})
export class HomePageComponent implements OnInit {
  usersService = inject(UsersService);
  postsService = inject(PostsService);
  router = inject(Router);

  userRole: UserRole | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: DisplayFieldName[] = [];
  displayFieldLabels = displayFieldLabels;
  dataSource = new MatTableDataSource<IPost>([]);
  selectedPost: IPost | null = null;

  dataLoading = true;
  clickAfterFocus = true;
  tabPressed = false;

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      this.tabPressed = true;
    }
  }

  async getUserRole(): Promise<UserRole | null> {
    return this.usersService.getUserRole();
  }

  async ngOnInit(): Promise<void> {
    await this.postsService.postsLoadedPromise;

    combineLatest([
      this.usersService.user$,
      this.postsService.userPosts$,
    ]).subscribe({
      next: async ([user, posts]) => {
        this.userRole = await this.getUserRole();
        if (this.userRole) {
          this.displayedColumns = userRoleMainDisplayFields[this.userRole];
        }
        this.dataSource.data = posts;
        this.dataLoading = false;

        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      },
      error: () => {
        this.dataLoading = false;
      },
    });
  }

  debug(): void {
    console.log('HomePageComponent @ debug():: ', { _this: this });
  }

  onRowClicked($event: Event, post: IPost): void {
    if (this.clickAfterFocus) {
      this.clickAfterFocus = false;
      return;
    }

    const target = $event?.target as HTMLElement;
    if (target) {
      this.focusPost(target, post);
    }

    // this.goToDetails();
  }

  onEnterPressed($event: Event, post: IPost): void {
    // this.goToDetails();
  }

  onFocusRow($event: FocusEvent, post: IPost): void {
    this.focusPost($event.target as HTMLElement, post);
  }

  onBlurRow($event: Event, post: IPost): void {
    this.selectedPost = null;
    this.clickAfterFocus = false;
    this.tabPressed = false
  }

  focusPost(rowElem: HTMLElement | null, post: IPost): void {
    if (!rowElem) return;

    let focusingElem: HTMLElement | null;

    const tagName = rowElem?.tagName;

    if (tagName === 'TR') {
      focusingElem = rowElem;
    } else {
      focusingElem = rowElem.closest('tr');
    }

    focusingElem?.focus();

    if (this.tabPressed) {
      this.clickAfterFocus = false;
      this.tabPressed = false
    } else {
      this.clickAfterFocus = this.selectedPost !== post;
    }

    this.selectedPost = post;
  }

  getFooterValue(field: DisplayFieldName): string {
    if (['title', 'count'].indexOf(field) === -1) {
      return '';
    }

    return field === 'title' ? 'Всего постов пользователя:' : (this.selectedPost?.count ?? 0).toString(10);
  }
}
