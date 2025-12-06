import {
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  OnInit,
  output,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';

import { AppHeaderComponent } from '../app-header/app-header.component';
import { AppLoaderComponent } from '../app-loader/app-loader.component';
import { UserRole } from '../../models/users.model';
import { DisplayFieldLabel, DisplayFieldName, IPost } from '../../models/posts.model';
import { AppScreenSize } from '../../models/common.model';
import { PostsService } from '../../services/posts/posts.service';
import { UsersService } from '../../services/users/users.service';

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
  postsService = inject(PostsService);
  usersService = inject(UsersService);

  dataSource = input.required<MatTableDataSource<IPost>>();
  showFooterRow = input<boolean>(false);
  displayedColumns = input<DisplayFieldName[]>([]);
  displayFieldLabels = input<DisplayFieldLabel>({});
  displayFieldLabelsShort = input<DisplayFieldLabel>({});
  selectable = input<boolean>(true);
  initialPostId = input<number>();

  dataLoading = input<boolean, boolean>(true, {
    transform: (value: boolean) => {
      if (!value) {
        setTimeout(() => {
          this.dataSource().paginator = this.paginator;
          this.dataSource().sort = this.sort;

          const initialPostId = this.initialPostId();
          if (initialPostId) {
            this.findAndScrollToRow(initialPostId, true);
          }
        });
      }
      return value;
    },
  });

  postClicked = output<IPost>();

  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChildren('tableRow', { read: ElementRef }) tableRows!: QueryList<ElementRef<HTMLTableRowElement>>;

  _selectedPost: IPost | null = null;
  userRole: UserRole | null = null;

  clickAfterFocus = true;
  tabPressed = false;

  private resizeListener?: () => void;
  screenSize?: AppScreenSize;

  useShortNames = false;

  preventUnselectResolver?: (needPrevent: boolean) => void;
  preventUnselectCheck: () => Promise<boolean> = () => new Promise<boolean>((resolve) => this.preventUnselectResolver = resolve);

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      this.tabPressed = true;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    let needPrevent = false;
    if (target) {
      const hasPreventDataAttrElem = target.closest('[data-prevent-unselect-row="true"]');
      needPrevent = !!hasPreventDataAttrElem;
    }
    this.preventUnselectResolver?.(needPrevent);
  }

  get _displayFieldLabels(): DisplayFieldLabel {
    return this.useShortNames ? this.displayFieldLabelsShort() : this.displayFieldLabels();
  }

  set selectedPost(post: IPost | null) {
    this._selectedPost = post;
    this.postsService.selectedPost = post;
  }

  get selectedPost(): IPost | null {
    return this._selectedPost;
  }

  async ngOnInit(): Promise<void> {
    this.resizeListener = this.renderer.listen('window', 'resize', (event) => {
      this.handleResize();
    });
    this.handleResize();
    this.userRole = await this.usersService.getUserRole();
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

  async onBlurRow($event: Event, post: IPost): Promise<void> {
    const preventUnselect = await this.preventUnselectCheck();
    if (!preventUnselect) {
      this.selectedPost = null;
      this.postsService.selectedPostElement = null;
    }
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
    this.postsService.selectedPostElement = focusingElem;
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

  private findAndScrollToRow(targetId: number, shouldFocus: boolean): void {
    // First, find which page contains our target row
    const rowIndex = this.dataSource().data.findIndex(row => row.id === targetId);

    if (rowIndex === -1) {
      // Row with ID not found
      return;
    }

    const pageSize = this.paginator.pageSize;
    const targetPage = Math.floor(rowIndex / pageSize);

    // If the row is not on the current page, change page first
    if (this.paginator.pageIndex !== targetPage) {
      this.paginator.pageIndex = targetPage;
      this.paginator._changePageSize(this.paginator.pageSize);

      // Wait for the page change to complete and rows to render
      setTimeout(() => {
        this.scrollToRowOnCurrentPage(targetId, shouldFocus);
      }, 100);
    } else {
      this.scrollToRowOnCurrentPage(targetId, shouldFocus);
    }
  }

  private scrollToRowOnCurrentPage(targetId: number, shouldFocus: boolean): void {
    // Give Angular time to render the rows after page change
    setTimeout(() => {
      const targetRow = this.tableRows.find(row => {
        const rowElement = row.nativeElement;
        const cell = rowElement?.querySelector('[data-id]') as HTMLElement;
        return cell && parseInt(cell.getAttribute('data-id')!) === targetId;
      });

      if (targetRow) {
        const rowElement = targetRow.nativeElement;

        // Scroll the row into view
        rowElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });

        // Focus if requested
        if (shouldFocus) {
          this.tabPressed = true;
          rowElement.focus();
        }
      }
    }, 50);
  }
}
