import { DisplayFieldLabel, UserDisplayFieldName } from '../../models/posts.model';

export const userRoleMainDisplayFields: UserDisplayFieldName = {
  user: ['title'],
  admin: ['userId', 'id', 'title', 'count']
};

export const userRoleDetailsDisplayFields: UserDisplayFieldName = {
  user: ['title', 'body'],
  admin: ['id', 'title', 'body']
};

export const displayFieldLabels: DisplayFieldLabel = {
  userId: 'ID пользователя',
  id: '№',
  title: 'Заголовок',
  body: 'Текст',
  count: 'Количество постов пользователя',
}

export const displayFieldLabelsShort: DisplayFieldLabel = {
  userId: 'ID пол-теля',
  id: '№',
  title: 'Заголовок',
  body: 'Текст',
  count: 'Кол-во постов',
}
