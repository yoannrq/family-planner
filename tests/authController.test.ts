// [ Package imports ]
import { describe, it, expect, vi, beforeEach, test, afterEach } from 'vitest';
import { Request, Response } from 'express';

// [ Local imports ]
import authController from '../src/controllers/authController.js';
import deleteEntry from '../src/utils/deleteEntry.js';

// [ Tests ]
describe('AuthController Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should have a signup method', () => {
    expect(authController.signup).toBeDefined();
  });

  it('should send a 400 status code if the password is invalid', async () => {
    const entryData = {
      name: 'John Doe',
      email: 'john@doe.com',
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

    expect(next).toHaveBeenCalledWith({
      status: 400,
      message: expect.stringContaining(
        "The field 'password' must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character.",
      ),
    });
  });

  it('should insert a new user', async () => {
    const entryData = {
      name: 'John Doe',
      email: 'john@doe.com',
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
        name: 'John Doe',
        email: 'john@doe.com',
        password: '',
      }),
    );
  });

  it('should have a login method', () => {
    expect(authController.login).toBeDefined();
  });

  it('should login an existing user', async () => {
    const entryData = {
      email: 'john@doe.com',
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
        name: 'John Doe',
        email: 'john@doe.com',
        password: '',
      }),
    );

    // Clean up the database
    const isDeleted = await deleteEntry('User', 'email', 'john@doe.com');
    expect(isDeleted).toBe(true);
  });
});
