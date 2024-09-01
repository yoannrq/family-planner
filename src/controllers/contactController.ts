// [ Package imports ]
import { Request, Response, NextFunction } from 'express';

// [ Local imports ]
import prisma from '../models/client.js';
import { Contact, Prisma } from '@prisma/client';
import canAccessToGroup from '../utils/canAccessToGroup.js';
import {
  ContactInput,
  contactSchema,
} from '../utils/validations/contactSchema.js';

const contactController = {
  getContacts: async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next({
        status: 401,
        message: 'Unauthorized',
      });
    }
    const userEmail = req.user.email;
    const groupId = parseInt(req.params.groupId);

    try {
      // Check if user can access the group
      const canAccess = await canAccessToGroup(groupId, userEmail);

      if (!canAccess) {
        return next({
          status: 403,
          message: 'Forbidden',
        });
      }

      const contacts: Contact[] = await prisma.contact.findMany({
        where: {
          groupId,
        },
      });

      return res.status(200).json(contacts);
    } catch (error: any) {
      return next({
        message: error.message,
      });
    }
  },

  createContact: async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next({
        status: 401,
        message: 'Unauthorized',
      });
    }
    const userEmail = req.user.email;
    const groupId = parseInt(req.params.groupId);
    const contactInput: ContactInput = req.body;

    // Zod schema validation with partial() to allow missing groupId
    const { success, data, error } = contactSchema
      .partial({ groupId: true })
      .safeParse(contactInput);

    if (!success) {
      return next({
        status: 400,
        message: error.errors.map((err) => err.message).join(', '),
      });
    }

    //Check if groupId in params is the same as groupId in body, if provided (wich is stored in svelte store as Contact object)
    if (data.groupId && data.groupId !== groupId) {
      return next({
        status: 401,
        message: 'Unauthorized',
      });
    }

    try {
      // Check if user can access the group
      const canAccess = await canAccessToGroup(groupId, userEmail);

      if (!canAccess) {
        return next({
          status: 403,
          message: 'Forbidden',
        });
      }

      const newContact: Contact = await prisma.contact.create({
        data: {
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          phone: data.phone,
          address: data.address,
          type: data.type,
          content: data.content,
          color: {
            connect: {
              id: data.colorId,
            },
          },
          group: {
            connect: {
              id: groupId,
            },
          },
        },
      });

      return res.status(201).json(newContact);
    } catch (error: any) {
      return next({
        message: error.message,
      });
    }
  },

  updateContact: async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next({
        status: 401,
        message: 'Unauthorized',
      });
    }
    const userEmail = req.user.email;
    const groupId = parseInt(req.params.groupId);
    const contactId = parseInt(req.params.contactId);
    const contactInput: ContactInput = req.body;

    const { success, data, error } = contactSchema
      .partial()
      .safeParse(contactInput);

    if (!success) {
      return next({
        status: 400,
        message: error.errors.map((err) => err.message).join(', '),
      });
    }

    //Check if groupId in params is the same as groupId in body, if provided (wich is stored in svelte store as Contact object)
    if (data.groupId && data.groupId !== groupId) {
      return next({
        status: 401,
        message: 'Unauthorized',
      });
    }

    try {
      // Check if user can access the group
      const canAccess = await canAccessToGroup(groupId, userEmail);

      if (!canAccess) {
        return next({
          status: 403,
          message: 'Forbidden',
        });
      }

      const isContactExist: Contact | null = await prisma.contact.findFirst({
        where: {
          id: contactId,
        },
      });

      if (!isContactExist) {
        return next({
          status: 404,
          message: 'Not found',
        });
      }

      const updatedContact: Prisma.ContactUpdateInput =
        await prisma.contact.update({
          where: {
            id: contactId,
          },
          data,
        });

      return res.status(200).json(updatedContact);
    } catch (error: any) {
      return next({
        message: error.message,
      });
    }
  },
};

export default contactController;
