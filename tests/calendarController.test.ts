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
import calendarController from '../src/controllers/calendarController.js';
import createTestUser from './helpers/authHelper.js';
import prisma from '../src/models/client.js';
import { User, Group, CalendarEntry } from '@prisma/client';
import randomizer from '../src/utils/randomizer.js';

let testUser: User;
let testGroup: Group | null;
let testCalendarEntry: CalendarEntry | null;

// [ Tests ]
describe('Calendar Controller Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  beforeAll(async () => {
    testUser = await createTestUser('calendar');
    testGroup = await prisma.group.findFirst({
      where: {
        users: {
          some: {
            email: testUser.email,
          },
        },
      },
    });

    if (!testGroup) {
      testGroup = await prisma.group.create({
        data: {
          name: randomizer.name(),
          color: {
            connect: {
              id: randomizer.id(),
            },
          },
          users: {
            connect: {
              email: testUser.email,
            },
          },
          owner: {
            connect: {
              email: testUser.email,
            },
          },
        },
      });
    }

    testCalendarEntry = await prisma.calendarEntry.create({
      data: {
        title: randomizer.name(),
        description: randomizer.name(),
        startAt: new Date().toISOString(),
        color: {
          connect: {
            id: randomizer.id(),
          },
        },
        author: {
          connect: {
            email: testUser.email,
          },
        },
        group: {
          connect: {
            id: testGroup.id,
          },
        },
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(async () => {
    await prisma.calendarEntry.deleteMany({
      where: {
        author: {
          email: testUser.email,
        },
      },
    });

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

  it('should have a getCalendarEntries method', () => {
    expect(calendarController.getCalendarEntries).toBeDefined();
  });

  it('should return 401 if user is not authenticated', async () => {
    const req = { user: undefined } as Request;
    const res = {} as Response;
    const next = vi.fn();

    await calendarController.getCalendarEntries(req, res, next);

    expect(next).toHaveBeenCalledWith({
      status: 401,
      message: 'Unauthorized',
    });
  });

  it('should return 403 if user is not authorized', async () => {
    const req = {
      user: {
        email: 'calendarcalendar@test.com',
      },
      params: { groupId: 1 },
    } as unknown as Request;
    const res = {} as Response;
    const next = vi.fn();

    await calendarController.getCalendarEntries(req, res, next);

    expect(next).toHaveBeenCalledWith({
      status: 403,
      message: 'Forbidden',
    });
  });

  it('should return calendar entries', async () => {
    const req = {
      user: testUser,
      params: { groupId: testGroup?.id },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnValue({
        json: vi.fn(),
      }),
    } as unknown as Response;
    const next = vi.fn();

    await calendarController.getCalendarEntries(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status(200).json).toHaveBeenCalledWith([testCalendarEntry]);
  });
});
