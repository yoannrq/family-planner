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
import { User, Group } from '@prisma/client';
import randomizer from '../src/utils/randomizer.js';

let testGroup: Group;
let secondTestGroup: Group;
let thirdTestGroup: Group;
let fourthTestGroup: Group;
let testUser: User;
let secondTestUser: User;
let thirdTestUser: User;

// [ Tests ]
describe('GroupController Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  beforeAll(async () => {
    testUser = await createTestUser('group');
    secondTestUser = await createTestUser('secondgroup');
    testGroup = await prisma.group.create({
      data: {
        name: randomizer.name(),
        colorId: randomizer.id(),
        users: {
          connect: {
            email: testUser.email,
          },
        },
        ownerId: testUser.id,
      },
    });
    secondTestGroup = await prisma.group.create({
      data: {
        name: randomizer.name(),
        colorId: randomizer.id(),
        users: {
          connect: [{ email: testUser.email }, { email: secondTestUser.email }],
        },
        ownerId: testUser.id,
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(async () => {
    await prisma.group.deleteMany({
      where: {
        users: {
          some: {
            email: {
              in: [testUser.email, secondTestUser.email, thirdTestUser.email],
            },
          },
        },
      },
    });

    await prisma.user.deleteMany({
      where: {
        email: {
          in: [testUser.email, secondTestUser.email, thirdTestUser.email],
        },
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
        email: testUser.email,
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
      expect.arrayContaining([
        expect.objectContaining(testGroup),
        expect.objectContaining(secondTestGroup),
      ]),
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
        colorId: randomizer.id(),
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
        colorId: randomizer.id(),
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
        colorId: randomizer.id(),
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
        name: randomizer.name(),
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
        email: `${randomizer.name()}@test.com`,
      },
      body: {
        name: randomizer.name(),
        colorId: randomizer.id(),
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
    const randomNameCreation = randomizer.name();
    const randomColorIdCreation = randomizer.id();
    const req = {
      user: {
        email: testUser.email,
      },
      body: {
        name: randomNameCreation,
        colorId: randomColorIdCreation,
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
        name: randomNameCreation,
        colorId: randomColorIdCreation,
        ownerId: testUser.id,
      }),
    );
  });

  it('should have a removeUserFromGroup method', () => {
    expect(groupController.removeUserFromGroup).toBeDefined();
  });

  it('should return a 401 status code if the user is not authenticated', async () => {
    const req = {} as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await groupController.removeUserFromGroup(req, res, next);

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
        email: testUser.email,
      },
      params: {
        groupId: testGroup.id,
        userId: testUser.id + 999,
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await groupController.removeUserFromGroup(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 404,
        message: 'User not found',
      }),
    );
  });

  it('should return a 404 status code if the group is not found', async () => {
    const req = {
      user: {
        email: testUser.email,
      },
      params: {
        groupId: testGroup.id + 9999999,
        userId: testUser.id,
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await groupController.removeUserFromGroup(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 404,
        message: 'Group not found',
      }),
    );
  });

  it('should return a 403 status code if the user is not the owner of the group', async () => {
    const req = {
      user: {
        email: secondTestUser.email,
      },
      params: {
        groupId: secondTestGroup.id,
        userId: testUser.id,
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await groupController.removeUserFromGroup(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 403,
        message: 'Forbidden',
      }),
    );
  });

  it('should return a 403 status code if the user is the owner of the group', async () => {
    const req = {
      user: {
        id: testUser.id,
        email: testUser.email,
      },
      params: {
        groupId: secondTestGroup.id,
        userId: testUser.id,
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await groupController.removeUserFromGroup(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 403,
        message:
          'You cannot remove yourself from a group you own, you should promote another user to owner first',
      }),
    );
  });

  it('should create a new group if the user to be removed dont have any other group and then remove this user from the group targeted', async () => {
    thirdTestUser = await createTestUser('thirdgroup');
    thirdTestGroup = await prisma.group.create({
      data: {
        name: randomizer.name(),
        colorId: randomizer.id(),
        users: {
          connect: [{ email: testUser.email }, { email: thirdTestUser.email }],
        },
        ownerId: testUser.id,
      },
    });
    const req = {
      user: { ...testUser },
      params: {
        groupId: thirdTestGroup.id,
        userId: thirdTestUser.id,
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await groupController.removeUserFromGroup(req, res, next);

    const newGroup = await prisma.group.findFirst({
      where: {
        ownerId: thirdTestUser.id,
      },
    });

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ ...thirdTestGroup }),
    );
    expect(newGroup).toMatchObject({
      ownerId: thirdTestUser.id,
      name: `${thirdTestUser.name.substring(0, 10)}'s new family`,
    });
  });

  it('should have an addUserToGroup method', () => {
    expect(groupController.addUserToGroup).toBeDefined();
  });

  it('should return a 401 status code if the user is not authenticated', async () => {
    const req = {} as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await groupController.addUserToGroup(req, res, next);

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
        id: testUser.id,
        email: testUser.email,
      },
      params: {
        groupId: testGroup.id,
        userId: testUser.id + 999,
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await groupController.addUserToGroup(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 404,
        message: 'User not found',
      }),
    );
  });

  it('should return a 404 status code if the group is not found', async () => {
    const req = {
      user: {
        id: testUser.id,
        email: testUser.email,
      },
      params: {
        groupId: testGroup.id + 9999999,
        userId: secondTestUser.id,
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await groupController.addUserToGroup(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 404,
        message: 'Group not found',
      }),
    );
  });

  it('should return a 409 status code if the user is already in the group', async () => {
    const req = {
      user: {
        id: testUser.id,
        email: testUser.email,
      },
      params: {
        groupId: testGroup.id,
        userId: testUser.id,
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await groupController.addUserToGroup(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 409,
        message: 'User is already in the group',
      }),
    );
  });

  it('should return a 403 status code if the user is not in the group where he wants to add another user', async () => {
    const req = {
      user: {
        id: secondTestUser.id,
        email: secondTestUser.email,
      },
      params: {
        groupId: testGroup.id,
        userId: secondTestUser.id,
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await groupController.addUserToGroup(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 403,
        message: 'Forbidden',
      }),
    );
  });

  it('should add a user to a group', async () => {
    fourthTestGroup = await prisma.group.create({
      data: {
        name: randomizer.name(),
        colorId: randomizer.id(),
        users: {
          connect: { email: testUser.email },
        },
        ownerId: testUser.id,
      },
    });
    const req = {
      user: {
        id: testUser.id,
        email: testUser.email,
      },
      params: {
        groupId: fourthTestGroup.id,
        userId: secondTestUser.id,
      },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await groupController.addUserToGroup(req, res, next);

    const updatedGroup = await prisma.group.findUnique({
      where: { id: fourthTestGroup.id },
      include: {
        users: true,
      },
    });

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ ...updatedGroup }),
    );
    expect(updatedGroup?.users).toMatchObject([
      expect.objectContaining({ id: testUser.id }),
      expect.objectContaining({ id: secondTestUser.id }),
    ]);
  });
});
