import { Component, HostListener, inject, input, OnInit, output, Renderer2, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';

import { AppHeaderComponent } from '../app-header/app-header.component';
import { AppLoaderComponent } from '../app-loader/app-loader.component';
import { UserRole } from '../../models/users.model';
import { DisplayFieldLabel, DisplayFieldName, IPost } from '../../models/posts.model';
import { AppScreenSize } from '../../models/common.model';

@Component({
  selector: 'app-posts-table',
  templateUrl: './posts-table.component.html',
  styleUrl: './posts-table.component.scss',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    AppHeaderComponent,
    MatButton,
    NgForOf,
    AppLoaderComponent,
    MatSort,
    AsyncPipe,
    NgClass,
    NgIf,
  ],
})
export class PostsTableComponent implements OnInit {
  renderer = inject(Renderer2);

  dataSource = input.required<MatTableDataSource<IPost>>();
  userRole = input<UserRole | null>(null);
  displayedColumns = input<DisplayFieldName[]>([]);
  displayFieldLabels = input<DisplayFieldLabel>({});
  displayFieldLabelsShort = input<DisplayFieldLabel>({});

  dataLoading = input<boolean, boolean>(true, {
    transform: (value: boolean) => {
      if (!value) {
        setTimeout(() => {
          this.dataSource().paginator = this.paginator;
          this.dataSource().sort = this.sort;
        });
      }
      return value;
    },
  });

  postClicked = output<IPost>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selectedPost: IPost | null = null;

  clickAfterFocus = true;
  tabPressed = false;

  private resizeListener?: () => void;
  screenSize?: AppScreenSize;

  useShortNames = false;

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      this.tabPressed = true;
    }
  }

  get _displayFieldLabels(): DisplayFieldLabel {
    return this.useShortNames ? this.displayFieldLabelsShort() : this.displayFieldLabels();
  }

  async ngOnInit(): Promise<void> {
    this.resizeListener = this.renderer.listen('window', 'resize', (event) => {
      this.handleResize();
    });
    this.handleResize();
  }

  /**
   * Для адаптива через 'resize'.
   * @private
   */
  private handleResize() {
    const width = window.innerWidth;

    this.setValueByWidth(width);

    this.checkDOM();
  }

  /**
   * Для адаптива через DOM
   * @private
   */
  private checkDOM(): void {
    const computedStyleWindowSize = window.getComputedStyle(document.documentElement).getPropertyValue('--screen-size');
    const widthStr = computedStyleWindowSize.replace(/\D+/g, '');
    const width = parseInt(widthStr);
    if (!isNaN(width)) {
      this.setValueByWidth(width);
    }
  }

  setValueByWidth(width: number): void {
    if (width < 576) {
      this.screenSize = 'xs-screen';
    } else if (width < 768) {
      this.screenSize = 'sm-screen';
    } else if (width < 992) {
      this.screenSize = 'md-screen';
    } else if (width < 1200) {
      this.screenSize = 'lg-screen';
    } else {
      this.screenSize = 'xl-screen';
    }

    this.useShortNames = ['sm-screen', 'xs-screen'].includes(this.screenSize);
  }

  onRowClicked($event: Event, post: IPost): void {
    if (this.clickAfterFocus) {
      this.clickAfterFocus = false;
      return;
    }
    this.onPostClicked(post);
  }

  onEnterPressed($event: Event, post: IPost): void {
    this.onPostClicked(post);
  }

  onFocusRow($event: FocusEvent, post: IPost): void {
    this.focusPost($event.target as HTMLElement, post);
  }

  onBlurRow($event: Event, post: IPost): void {
    this.selectedPost = null;
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

  onPostClicked(post: IPost): void {
    this.postClicked.emit(post);
  }
}
