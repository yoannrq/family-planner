// [ Package imports ]
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Request, Response } from 'express';

// [ Local imports ]
import groupController from '../src/controllers/groupController.js';
import exp from 'constants';

// [ Tests ]
describe('GroupController Tests', () => {
  it('should have a getGroups method', () => {
    expect(groupController.getGroups).toBeDefined();
  });

  it('should return a list of groups', async () => {
    const userGroups = [
      {
        name: 'Family',
        colorId: 1,
      },
      {
        name: 'Friends',
        colorId: 2,
      },
    ];

    const req = {
      user: {
        email: 'alice@smith.com',
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
        userGroups.map((group) => expect.objectContaining(group)),
      ),
    );
  });

  it('should have a createGroup method', () => {
    expect(groupController.createGroup).toBeDefined();
  });

  it('should create a new group', async () => {
    const randomColorId = Math.floor(Math.random() * 9) + 1;
    const randomColorIdToString = randomColorId.toString();
    const randomGroupName = (Math.random() + 1).toString(36).substring(7);
    const req = {
      user: {
        email: 'alice@smith.com',
      },
      body: {
        name: randomGroupName,
        colorId: randomColorIdToString,
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
