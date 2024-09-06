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
import { User } from '@prisma/client';

let testGroups: GroupInput[] = [];
let testUser: User;
const randomId = Math.floor(Math.random() * 9) + 1;
const randomName = (Math.random() + 1).toString(36).substring(7);

// [ Tests ]
describe('GroupController Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  beforeAll(async () => {
    testUser = await createTestUser('group');
    testGroups = [
      {
        name: 'Group 1',
        colorId: 1,
        ownerId: testUser.id,
      },
      {
        name: 'Group 2',
        colorId: 2,
        ownerId: testUser.id,
      },
    ];

    for (const group of testGroups) {
      await prisma.group.create({
        data: {
          name: group.name,
          colorId: group.colorId,
          users: {
            connect: {
              email: testUser.email,
            },
          },
          ownerId: testUser.id,
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
        colorId: randomId,
        ownerId: testUser.id,
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
        colorId: randomId,
        ownerId: testUser.id,
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
        colorId: randomId,
        ownerId: testUser.id,
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
        name: randomName,
        colorId: '1',
        ownerId: testUser.id,
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

  it('should return a 404 status code if the user is not found', async () => {
    const req = {
      user: {
        email: `${randomName}@test.com`,
      },
      body: {
        name: randomName,
        colorId: randomId,
        ownerId: testUser.id,
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
        status: 404,
        message: 'User not found',
      }),
    );
  });

  it('should create a new group', async () => {
    const req = {
      user: {
        email: testUser.email,
      },
      body: {
        name: randomName,
        colorId: randomId,
        ownerId: testUser.id,
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
        name: randomName,
        colorId: randomId,
        ownerId: testUser.id,
      }),
    );
  });
});
