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
import meController from '../src/controllers/meController.js';
import createTestUser from './helpers/authHelper.js';
import prisma from '../src/models/client.js';
import { User } from '@prisma/client';

// [ Variables ]
let testUser: User;

// [ Tests ]
describe('meController Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  beforeAll(async () => {
    testUser = await createTestUser('myself');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(async () => {
    await prisma.group.deleteMany({
      where: {
        users: {
          some: {
            email: testUser.email,
          },
        },
      },
    });

    await prisma.user.deleteMany({
      where: {
        email: testUser.email,
      },
    });
  });

  it('should have a updateMe method', () => {
    expect(meController.updateMe).toBeDefined();
  });

  it('should return 401 if user is not authenticated', async () => {
    const req = {} as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await meController.updateMe(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 401,
        message: 'Unauthorized',
      }),
    );
  });

  it('should update user information', async () => {
    const req = {
      user: testUser,
      body: {
        name: 'Myself Updated',
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await meController.updateMe(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Myself Updated',
      }),
    );
  });
});
