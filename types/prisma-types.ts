import { Group, User } from '@prisma/client';

export type GroupWithUsers = Group & {
  users: User[];
};
