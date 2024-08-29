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
import contactController from '../src/controllers/contactController.js';
import createTestUser from './helpers/authHelper.js';
import prisma from '../src/models/client.js';

// [ Variables ]
// TODO Reprendre les types proprement
let testUser: any;
let groupOfTestUser: any;
const testContacts = [
  {
    firstname: 'Contact 1',
    lastname: 'Test',
    email: 'contact1@test.com',
    phone: '1234567890',
    address: '123 Main St',
  },
  {
    firstname: 'Contact 2',
    lastname: 'Test',
    email: 'contact2@test.com',
    phone: '1234567890',
    type: 'Friend',
    content: 'Best friend',
  },
];
const randomName = (Math.random() + 1).toString(36).substring(7);

// [ Tests ]
describe('ContactController Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  beforeAll(async () => {
    testUser = await createTestUser('contact');
    groupOfTestUser = await prisma.group.findFirst({
      where: {
        users: {
          some: {
            email: testUser.email,
          },
        },
      },
    });

    if (!groupOfTestUser) {
      groupOfTestUser = await prisma.group.create({
        data: {
          name: 'Test Group',
          users: {
            connect: {
              email: testUser.email,
            },
          },
        },
      });
    }

    for (const contact of testContacts) {
      await prisma.contact.create({
        data: {
          ...contact,
          group: {
            connect: {
              id: groupOfTestUser.id,
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
    await prisma.contact.deleteMany({
      where: {
        group: {
          users: {
            some: {
              email: testUser.email,
            },
          },
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

  it('should have a getContacts method', () => {
    expect(contactController.getContacts).toBeDefined();
  });

  it('should return a 401 status code if the user is not authenticated', async () => {
    const req = {} as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await contactController.getContacts(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 401,
        message: 'Unauthorized',
      }),
    );
  });

  it('should return a 403 status code if the user is not authorized to access the group', async () => {
    const req = {
      user: {
        email: 'contactcontact@test.com',
      },
      params: {
        groupId: 1,
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await contactController.getContacts(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 403,
        message: 'Forbidden',
      }),
    );
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return a list of contacts', async () => {
    const req = {
      user: {
        email: testUser.email,
      },
      params: {
        groupId: groupOfTestUser.id,
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await contactController.getContacts(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ ...testContacts[0] }),
        expect.objectContaining({ ...testContacts[1] }),
      ]),
    );
  });

  it('should have a createContact method', () => {
    expect(contactController.createContact).toBeDefined();
  });

  it('should return a 401 status code if the user is not authenticated', async () => {
    const req = {} as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await contactController.createContact(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 401,
        message: 'Unauthorized',
      }),
    );
  });

  it('should return a 400 status code if the colorId is a string', async () => {
    const req = {
      user: {
        email: testUser.email,
      },
      params: {
        groupId: groupOfTestUser.id,
      },
      body: {
        firstname: 'Contact 3',
        lastname: 'Test',
        colorId: '1',
        groupId: groupOfTestUser.id,
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await contactController.createContact(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 400,
        message: "The field 'colorId' must be a number.",
      }),
    );
  });

  it('should return a 401 status code if the group id in body is different from the group id in params', async () => {
    const wrongGroupId = groupOfTestUser.id - 1;
    const req = {
      user: {
        email: testUser.email,
      },
      params: {
        groupId: groupOfTestUser.id,
      },
      body: {
        firstname: 'Contact 3',
        lastname: 'Test',
        colorId: 1,
        groupId: wrongGroupId,
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await contactController.createContact(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 401,
        message: 'Unauthorized',
      }),
    );
  });

  it('should return a 403 status code if the user is not authorized to access the group', async () => {
    const req = {
      user: {
        email: `${randomName}@test.com`,
      },
      params: {
        groupId: groupOfTestUser.id,
      },
      body: {
        firstname: 'Contact 3',
        lastname: 'Test',
        colorId: 1,
        groupId: groupOfTestUser.id,
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await contactController.createContact(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 403,
        message: 'Forbidden',
      }),
    );
  });

  it('should create a contact', async () => {
    const req = {
      user: {
        email: testUser.email,
      },
      params: {
        groupId: groupOfTestUser.id,
      },
      body: {
        firstname: 'Contact 3',
        lastname: 'Test',
        colorId: 1,
        groupId: groupOfTestUser.id,
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await contactController.createContact(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        firstname: 'Contact 3',
        lastname: 'Test',
        colorId: 1,
        groupId: groupOfTestUser.id,
      }),
    );
  });

  it('should have an updateContact method', () => {
    expect(contactController.updateContact).toBeDefined();
  });

  it('should return a 401 status code if the user is not authenticated', async () => {
    const req = {} as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await contactController.updateContact(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 401,
        message: 'Unauthorized',
      }),
    );
  });

  it('should return a 400 status code if the colorId is a string', async () => {
    const req = {
      user: {
        email: testUser.email,
      },
      params: {
        groupId: groupOfTestUser.id,
        contactId: 1,
      },
      body: {
        colorId: '1',
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await contactController.updateContact(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 400,
        message: "The field 'colorId' must be a number.",
      }),
    );
  });

  it('should return a 401 status code if the group id in body is different from the group id in params', async () => {
    const wrongGroupId = groupOfTestUser.id - 1;
    const req = {
      user: {
        email: testUser.email,
      },
      params: {
        groupId: groupOfTestUser.id,
        contactId: 1,
      },
      body: {
        colorId: 1,
        groupId: wrongGroupId,
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await contactController.updateContact(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 401,
        message: 'Unauthorized',
      }),
    );
  });

  it('should return a 403 status code if the user is not authorized to access the group', async () => {
    const req = {
      user: {
        email: `${randomName}@test.com`,
      },
      params: {
        groupId: groupOfTestUser.id,
      },
      body: {
        firstname: 'Contact 3',
        lastname: 'Test',
        colorId: 1,
        groupId: groupOfTestUser.id,
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await contactController.updateContact(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 403,
        message: 'Forbidden',
      }),
    );
  });

  it('should return a 404 status code if the contact does not exist', async () => {
    const req = {
      user: {
        email: testUser.email,
      },
      params: {
        groupId: groupOfTestUser.id,
        contactId: 99999,
      },
      body: {
        colorId: 1,
        groupId: groupOfTestUser.id,
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await contactController.updateContact(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 404,
        message: 'Not found',
      }),
    );
  });

  it('should update a contact', async () => {
    const req = {
      user: {
        email: testUser.email,
      },
      params: {
        groupId: groupOfTestUser.id,
        contactId: 1,
      },
      body: {
        firstname: 'Contact 1 Updated',
        lastname: 'Test',
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await contactController.updateContact(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        firstname: 'Contact 1 Updated',
        lastname: 'Test',
      }),
    );
  });
});
