import { Group, User } from '@prisma/client';

export type GroupWithUsers = Group & {
  users: User[];
};

export type UserWithGroups = User & {
  groups: Group[];
};
