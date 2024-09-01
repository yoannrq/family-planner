// [ Package imports ]
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  afterAll,
  beforeAll,
} from 'vitest';
import { Request, Response } from 'express';

// [ Local imports ]
import groupController from '../src/controllers/groupController.js';
import createTestUser from './helpers/authHelper.js';
import prisma from '../src/models/client.js';
import { GroupInput } from '../src/utils/validations/groupSchema.js';
import { Prisma } from '@prisma/client';

const testGroups: GroupInput[] = [
  {
    name: 'Group 1',
    colorId: 1,
  },
  {
    name: 'Group 2',
    colorId: 2,
  },
];
const randomColorId = Math.floor(Math.random() * 9) + 1;
const randomGroupName = (Math.random() + 1).toString(36).substring(7);

// [ Tests ]
describe('GroupController Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  beforeAll(async () => {
    const testUser: Prisma.UserCreateInput = await createTestUser('group');

    for (const group of testGroups) {
      await prisma.group.create({
        data: {
          ...group,
          users: {
            connect: {
              email: testUser.email,
            },
          },
        },
      });
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(async () => {
    await prisma.group.deleteMany({
      where: {
        users: {
          some: {
            email: 'group@test.com',
          },
        },
      },
    });

    await prisma.user.deleteMany({
      where: {
        email: 'group@test.com',
      },
    });
  });

  it('should have a getGroups method', () => {
    expect(groupController.getGroups).toBeDefined();
  });

  it('should return a 401 status code if the user is not authenticated', async () => {
    const req = {} as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await groupController.getGroups(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 401,
        message: 'Unauthorized',
      }),
    );
  });

  it('should return a 404 status code if the user is not found', async () => {
    const req = {
      user: {
        email: 'groupgroup@test.com',
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await groupController.getGroups(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 404,
        message: 'User not found',
      }),
    );
  });

  it('should return a list of groups', async () => {
    const req = {
      user: {
        email: 'group@test.com',
      },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await groupController.getGroups(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining(
        testGroups.map((group) => expect.objectContaining(group)),
      ),
    );
  });

  it('should have a createGroup method', () => {
    expect(groupController.createGroup).toBeDefined();
  });

  it('should return a 401 status code if the user is not authenticated', async () => {
    const req = {} as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await groupController.createGroup(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 401,
        message: 'Unauthorized',
      }),
    );
  });

  it('should return a 400 status code if the group name is not a string', async () => {
    const req = {
      user: {
        email: 'group@test.com',
      },
      body: {
        name: 3,
        colorId: randomColorId,
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await groupController.createGroup(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 400,
        message: "The field 'name' must be a string.",
      }),
    );
  });

  it('should return a 400 status code if the group name is less than 3 characters', async () => {
    const req = {
      user: {
        email: 'group@test.com',
      },
      body: {
        name: 'a',
        colorId: randomColorId,
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await groupController.createGroup(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 400,
        message: "The field 'name' must be at least 3 characters long.",
      }),
    );
  });

  it('should return a 400 status code if the group name is more than 30 characters', async () => {
    const req = {
      user: {
        email: 'group@test.com',
      },
      body: {
        name: 'a'.repeat(31),
        colorId: randomColorId,
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await groupController.createGroup(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 400,
        message: "The field 'name' must be at most 30 characters long.",
      }),
    );
  });

  it('should return a 400 status code if the colorId is not a number', async () => {
    const req = {
      user: {
        email: 'group@test.com',
      },
      body: {
        name: randomGroupName,
        colorId: '1',
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await groupController.createGroup(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 400,
        message: "The field 'colorId' must be a number.",
      }),
    );
  });

  it('should create a new group', async () => {
    const req = {
      user: {
        email: 'group@test.com',
      },
      body: {
        name: randomGroupName,
        colorId: randomColorId,
      },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await groupController.createGroup(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        name: randomGroupName,
        colorId: randomColorId,
      }),
    );
  });
});
