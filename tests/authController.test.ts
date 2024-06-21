// [ Package imports ]
import { describe, it, expect, vi, beforeEach, test } from 'vitest';
import { Request, Response } from 'express';

// [ Local imports ]
import authController from '../src/controllers/authController.js';
import deleteEntry from '../src/utils/deleteEntry.js';

// [ Tests ]
describe('AuthController Tests', () => {
  it('should have a signup method', () => {
    expect(authController.signup).toBeDefined();
  });

  test('insert a new user', async () => {
    const entryData = {
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'Password123!',
    };

    // Mocking the request and response objects
    const req = {
      body: entryData,
      get: vi.fn(),
      header: vi.fn(),
      accepts: vi.fn(),
      acceptsCharsets: vi.fn(),
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const next = (error: any) => {
      expect(error).toBeUndefined();
    };

    await authController.signup(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'John Doe',
        email: 'john@doe.com',
        password: '',
      }),
    );

    const isDeleted = await deleteEntry('User', 'email', 'john@doe.com');
    expect(isDeleted).toBe(true);
  });
});
