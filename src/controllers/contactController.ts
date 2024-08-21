// [ Package imports ]
import { Request, Response, NextFunction } from 'express';

// [ Local imports ]
import prisma from '../models/client.js';
import canAccessToGroup from '../utils/canAccessToGroup.js';
import contactSchema from '../utils/validations/contactSchema.js';

const contactController = {
  getContacts: async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const userEmail = req.user.email;
    const groupId = parseInt(req.params.groupId);

    try {
      // Check if user can access the group
      const canAccess = await canAccessToGroup(groupId, userEmail);

      if (!canAccess) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      const contacts = await prisma.contact.findMany({
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

  updateContact: async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const userEmail = req.user.email;
    const groupId = parseInt(req.params.groupId);
    const contactId = parseInt(req.params.contactId);
    const { success, data, error } = contactSchema
      .partial()
      .safeParse(req.body);

    if (!success) {
      return next({
        status: 400,
        message: error.errors.map((err) => err.message).join(', '),
      });
    }

    try {
      // Check if user can access the group
      const canAccess = await canAccessToGroup(groupId, userEmail);

      if (!canAccess) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      const updatedContact = await prisma.contact.update({
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
