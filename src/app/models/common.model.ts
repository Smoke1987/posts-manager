import { AppFormGroup } from './utils.model';

import { IUser } from './users.model';
import { ICommonError } from './api.model';

export interface IAuthData {
  login: string;
  password: string;
}

export type LoginForm = AppFormGroup<IAuthData>;

export interface AppConfig {
  apiUrl: string;
  users: IUser[];
}

export interface ICommonResult {
  success: boolean;
  error?: ICommonError;
}

export interface IAuthResult extends ICommonResult {
  user?: IUser;
}

export const AllScreenSizes = [
  'xs-screen',
  'sm-screen',
  'md-screen',
  'lg-screen',
  'xl-screen',
] as const;
export type AppScreenSize = typeof AllScreenSizes[number];
