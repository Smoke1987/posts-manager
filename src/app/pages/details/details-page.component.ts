import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';

import { combineLatest } from 'rxjs';

import { AppHeaderComponent } from '../../components/app-header/app-header.component';
import {
  ContentWithButtonsLayoutComponent
} from '../../layouts/content-with-buttons-layout/content-with-buttons-layout.component';
import { PostsTableComponent } from '../../components/posts-table/posts-table.component';
import {
  displayFieldLabels,
  displayFieldLabelsShort,
  userRoleDetailsDisplayFields
} from '../../services/posts/posts.helper';
import { UsersService } from '../../services/users/users.service';
import { PostsService } from '../../services/posts/posts.service';
import { UserRole } from '../../models/users.model';
import { DisplayFieldName, IPost, PostEditMode } from '../../models/posts.model';
import { AlertsService } from '../../services/alerts/alerts.service';

@Component({
  selector: 'app-details',
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.scss'],
  standalone: true,
  imports: [
    AppHeaderComponent,
    ContentWithButtonsLayoutComponent,
    MatButton,
    NgIf,
    PostsTableComponent,
  ],
})
export class DetailsPageComponent implements OnInit {
  usersService = inject(UsersService);
  postsService = inject(PostsService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  alertsService = inject(AlertsService);

  userRole: UserRole | null = null;
  displayedColumns: DisplayFieldName[] = [];
  displayFieldLabels = displayFieldLabels;
  displayFieldLabelsShort = displayFieldLabelsShort;
  dataSource = new MatTableDataSource<IPost>([]);
  dataLoading = true;

  postsUserId?: number;
  title = 'Детализация';

  async ngOnInit(): Promise<void> {
    // this.postsService.selectedPost = null;

    const snapshot = this.route.snapshot;
    const userIdParam = snapshot.paramMap.get('userId');
    const userId = userIdParam ? parseInt(userIdParam) : null;
    if (userId) {
      this.postsUserId = userId;
    } else return;

    await this.postsService.postsLoadedPromise;

    combineLatest([
      this.usersService.user$,
      this.postsService.selectedUserPosts$(this.postsUserId),
    ]).subscribe({
      next: async ([user, posts]) => {
        this.userRole = await this.usersService.getUserRole();
        if (this.userRole) {
          this.displayedColumns = userRoleDetailsDisplayFields[this.userRole];
        } else {
          // TODO: нужно ли добавлять обработку когда у юзера нет UserRole
        }

        if (this.userRole === 'admin') {
          this.title = 'Детализация: пользователь #' + this.postsUserId
        } else {
          this.title = 'Детализация';
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

  goBack(): void {
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }

  editPost(isAdding = false): void {
    const mode: PostEditMode = isAdding ? 'add' : 'edit';
    const state = { editMode: mode, editingPost: this.postsService.selectedPost };
    this.router.navigate(['/edit-post'], { state });
  }

  removePost(): void {
    if (this.userRole !== 'admin') {
      this.alertsService.showErrorAlert('Вам не доступно данное действие', {
        restoreFocus: this.postsService.selectedPostElement ?? undefined,
      });
      return;
    }
  }
}
