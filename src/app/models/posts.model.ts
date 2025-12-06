import { UserRole } from './users.model';
import { AppFormGroupWithOptional, ModifyNumberToNullable } from './utils.model';

export interface IPost {
  userId: number;
  id: number;
  title: string;
  body: string;
  count?: number;
}

export const AllFieldNames = [
  'userId',
  'id',
  'title',
  'body',
  'count',
] as const;
export type DisplayFieldName = typeof AllFieldNames[number];

export type UserDisplayFieldName = { [Role in UserRole]: DisplayFieldName[] }

export type DisplayFieldLabel = { [Field in DisplayFieldName]?: string }

export type PostEditMode = 'add' | 'edit';

export type EditPostForm = AppFormGroupWithOptional<ModifyNumberToNullable<IPost>>;
