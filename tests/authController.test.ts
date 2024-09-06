// [ Package imports ]
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  afterAll,
} from 'vitest';
import { Request, Response } from 'express';

// [ Local imports ]
import authController from '../src/controllers/authController.js';
import prisma from '../src/models/client.js';

// [ Tests ]
describe('AuthController Tests', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(async () => {
    await prisma.group.deleteMany({
      where: {
        users: {
          some: {
            email: 'auth@test.com',
          },
        },
      },
    });

    await prisma.user.deleteMany({
      where: {
        email: 'auth@test.com',
      },
    });
  });

  it('should have a signup method', () => {
    expect(authController.signup).toBeDefined();
  });

  it('should send a 400 status code if the password is invalid', async () => {
    const entryData = {
      name: 'Auth Test User',
      email: 'auth@test.com',
      password: 'Password123',
      settingColorId: 1,
    };

    const req = { body: entryData } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await authController.signup(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 400,
        message: expect.stringContaining(
          "The field 'password' must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character.",
        ),
      }),
    );
  });

  it('should insert a new user', async () => {
    const entryData = {
      name: 'Auth Test User',
      email: 'auth@test.com',
      password: 'Password123!',
      settingColorId: 1,
    };

    const req = { body: entryData } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await authController.signup(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Auth Test User',
        email: 'auth@test.com',
      }),
    );

    const user = await prisma.user.findUnique({
      where: { email: 'auth@test.com' },
    });
    expect(user).toBeDefined();
    expect(user?.password).not.toBe('Password123!');
  });

  it('should send a 409 status code if the user already exists', async () => {
    const entryData = {
      name: 'Auth Test User',
      email: 'auth@test.com',
      password: 'Password123!',
      settingColorId: 1,
    };

    const req = { body: entryData } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await authController.signup(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 409,
        message: expect.stringContaining('User already exists'),
      }),
    );
  });

  it('should have created a group for the new user', async () => {
    const userGroup = await prisma.group.findFirst({
      where: {
        users: {
          some: {
            email: 'auth@test.com',
          },
        },
      },
    });

    const authTestUser = await prisma.user.findUnique({
      where: { email: 'auth@test.com' },
    });
    expect(userGroup).toMatchObject({
      name: `Auth Test 's family`,
      colorId: expect.any(Number),
      ownerId: authTestUser?.id,
    });
  });

  it('should have a login method', () => {
    expect(authController.login).toBeDefined();
  });

  it('should send a 401 status code if the email does not exist', async () => {
    const entryData = {
      email: 'authauth@test.com',
      password: 'Password123!',
    };

    const req = { body: entryData } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await authController.login(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 401,
        message: expect.stringContaining('Invalid email or password'),
      }),
    );
  });

  it('should send a 401 status code if the password is invalid', async () => {
    const entryData = {
      email: 'auth@test.com',
      password: 'Password1234!',
    };

    const req = { body: entryData } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await authController.login(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 401,
        message: expect.stringContaining('Invalid email or password'),
      }),
    );
  });

  it('should login an existing user', async () => {
    const entryData = {
      email: 'auth@test.com',
      password: 'Password123!',
    };

    const req = { body: entryData } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await authController.login(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Auth Test User',
        email: 'auth@test.com',
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      }),
    );
  });

  it('should have a newAccessToken method', () => {
    expect(authController.newAccessToken).toBeDefined();
  });

  it('should send a 400 status code if the refresh token is not provided', async () => {
    const req = { body: {} } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await authController.newAccessToken(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 400,
        message: expect.stringContaining('Refresh token is required'),
      }),
    );
  });

  it('should send a 401 status code if the refresh token is invalid', async () => {
    const entryData = { refreshToken: 'invalid' };

    const req = { body: entryData } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await authController.newAccessToken(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 401,
        message: expect.stringContaining('Refresh token expired'),
      }),
    );
  });

  it('should send an access token if the refresh token is valid', async () => {
    const user = await prisma.user.findUnique({
      where: { email: 'auth@test.com' },
    });
    const validRefreshToken = user?.refreshToken;

    const req = { body: { refreshToken: validRefreshToken } } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await authController.newAccessToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        accessToken: expect.any(String),
      }),
    );
  });
});
