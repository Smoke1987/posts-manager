import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { EditPostForm, IPost, PostEditMode } from '../../models/posts.model';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { Location, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { MatOption, MatSelect } from '@angular/material/select';
import { UserRole } from '../../models/users.model';
import { UsersService } from '../../services/users/users.service';
import { PostsService } from '../../services/posts/posts.service';
import { AppHeaderComponent } from '../../components/app-header/app-header.component';
import {
  ContentWithButtonsLayoutComponent
} from '../../layouts/content-with-buttons-layout/content-with-buttons-layout.component';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  ManualAutosizeDirective
} from '../../directives/text-area-auto-size.directive';
import { declOfNum } from '../../services/utils/utils.helpers';
import { ModifyNumberToNullable } from '../../models/utils.model';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatSuffix,
    MatError,
    NgIf,
    ReactiveFormsModule,
    MatSelect,
    MatOption,
    AppHeaderComponent,
    ContentWithButtonsLayoutComponent,
    CdkTextareaAutosize,
    ManualAutosizeDirective
  ]
})
export class EditPostComponent implements OnInit {
  router = inject(Router);
  usersService = inject(UsersService);
  postService = inject(PostsService);
  location = inject(Location);

  mode: PostEditMode = 'add';
  userRole: UserRole | null = null;
  title = 'Правка';

  postForm?: FormGroup<EditPostForm>;
  userIdControl?: FormControl<number | null>;
  postIdControl?: FormControl<number | null>;
  titleControl?: FormControl<string>;
  bodyControl?: FormControl<string>;

  allUserIds: number[] = [];
  availablePostId: number = -1;

  editingPost?: IPost;

  constructor(
    private fb: FormBuilder,
  ) {
    const _state = this.router.getCurrentNavigation()?.extras?.state;
    if (!_state || !_state['editMode']) {
      this.router.navigate(['/home']);
      return;
    }

    this.mode = _state['editMode'];
    this.title = this.mode === 'add' ? 'Добавление' : 'Правка';

    if (this.mode === 'edit' && !_state['editingPost']) {
      this.router.navigate(['/home']);
      return;
    }

    this.editingPost = _state['editingPost'];
  }

  async ngOnInit(): Promise<void> {
    this.userRole = await this.usersService.getUserRole();
    if (!this.userRole) {
      this.router.navigate(['/home']);
      return;
    }

    const controls: EditPostForm = {};

    if (this.userRole === 'admin') {
      this.userIdControl = this.fb.control({ value: null, disabled: false }, Validators.required);
      controls.userId = this.userIdControl;

      this.postIdControl = this.fb.control(
        { value: null, disabled: this.mode === 'edit' },
        {
          asyncValidators: [this.validatePostId.bind(this)],
        });
      controls.id = this.postIdControl;

      this.allUserIds = await this.postService.getAllUsersIds();
      this.availablePostId = await this.postService.findFirstAvailablePostIds();
    }

    this.titleControl = this.fb.nonNullable.control(
      { value: '', disabled: false },
      Validators.compose([Validators.required, Validators.maxLength(30)])
    );
    controls.title = this.titleControl;

    this.bodyControl = this.fb.nonNullable.control({ value: '', disabled: false }, Validators.required);
    controls.body = this.bodyControl;

    this.postForm = new FormGroup<EditPostForm>(controls);

    if (this.mode === 'edit') {
      this.patchValues();
    }

    // Если обновили страницу - назначим "выбранный пост"
    if (!this.postService.selectedPost && this.editingPost)  {
      this.postService.selectedPost = this.editingPost;
    }
  }

  async validatePostId(control: AbstractControl<number | null>): Promise<ValidationErrors | null> {
    const controlErrors: ValidationErrors | null = control.errors;
    const value = control.value;

    let resultErrors: ValidationErrors | null = { ...controlErrors };

    if (value && value.toString().replace(/\d+/g, '').length) {
      resultErrors['NaNError'] = 'Значение должно быть целым числом';
    } else {
      delete resultErrors['NaNError'];
    }

    if (!value) {
      resultErrors['required'] = true;
    } else {
      delete resultErrors['required'];
    }

    // Поле не пустое, введено целое число
    if (value !== null && !Object.keys(resultErrors).length) {
      // Проверяем доступность ID публикации
      const isAvailablePostId = await this.postService.checkAvailablePostId(value);
      if (!isAvailablePostId) {
        resultErrors['NotAvailable'] = 'Публикация с таким ID уже существует';
      } else {
        delete resultErrors['NotAvailable'];
      }
    }

    return Object.keys(resultErrors).length ? resultErrors : null;
  }

  patchValues(): void {
    this.postForm?.patchValue({ ...this.editingPost }, { emitEvent: true });
    this.postForm?.markAllAsTouched();
  }

  goBack(): void {
    this.location.back();
  }

  onSubmitClicked(): void {
    if (!this.postForm?.valid) {
      return;
    }
    switch (this.mode) {
      case 'add':
        this.submitAdd();
        break;
      default:
        this.submitEdit();
    }
  }

  submitAdd(): void {

  }

  submitEdit(): void {
    const formValue: Partial<ModifyNumberToNullable<IPost>> = this.postForm?.value || {};

    const postChanged = this.postHasChanges();

    if (postChanged) {
      const updatedPost = {
        ...this.editingPost,
        ...this.postForm?.value,
      };
      this.postService.updatePost(updatedPost);
    }
  }

  postHasChanges(): boolean {
    const formValue: Partial<ModifyNumberToNullable<IPost>> = this.postForm?.value || {};

    return Object.keys(formValue)
      .reduce((previousValue, currentValue) => {
        const fieldFormValue = formValue[currentValue as keyof IPost];
        const fieldPostValue = this.editingPost?.[currentValue as keyof IPost];

        return previousValue || fieldFormValue !== fieldPostValue;
      }, false);
  }

  getTitleError(params?: { actualLength: number, requiredLength: number }): string {
    if (!params) return '';

    const reqText = declOfNum(params.requiredLength, ['символ', 'символа', 'символов']);
    const actText = declOfNum(params.actualLength, ['символ', 'символа', 'символов']);
    return `Допустимая длина заголовка: ${params.requiredLength} ${reqText}, текущая длина: ${params.actualLength} ${actText}`;
  }
}
