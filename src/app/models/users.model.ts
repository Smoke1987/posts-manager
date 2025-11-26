export const AllUserRoles = [
  'user',
  'admin',
] as const;
export type UserRole = typeof AllUserRoles[number];

export interface IUser {
  login: string;
  password: string;
  role: UserRole;
}
