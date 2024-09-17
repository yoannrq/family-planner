// [ Package imports ]
import { Request, Response, NextFunction } from 'express';

// [ Local imports ]
import prisma from '../models/client.js';
import { CalendarEntry } from '@prisma/client';
import canAccessToGroup from '../utils/canAccessToGroup.js';
import {
  calendarEntrySchema,
  CalendarEntryInput,
} from '../utils/validations/calendarEntrySchema.js';
import { isValidColorId } from '../utils/colors.js';

const calendarController = {
  getCalendarEntries: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
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

      const calendarEntries: CalendarEntry[] =
        await prisma.calendarEntry.findMany({
          where: {
            groupId,
          },
        });

      return res.status(200).json(calendarEntries);
    } catch (error: any) {
      return next({
        message: error.message,
      });
    }
  },

  createCalendarEntry: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) {
      return next({
        status: 401,
        message: 'Unauthorized',
      });
    }
    const userEmail = req.user.email;
    const groupId = parseInt(req.params.groupId);
    const calendarEntryInput: CalendarEntryInput = req.body;

    // Zod schema validation with partial() to allow missing groupId
    const { success, data, error } = calendarEntrySchema
      .partial({ groupId: true })
      .safeParse(calendarEntryInput);

    if (!success) {
      return next({
        status: 400,
        message: error.errors.map((err) => err.message).join(', '),
      });
    }

    try {
      // Check if user can access the group
      const canAccess = await canAccessToGroup(groupId, userEmail);

      if (!canAccess || req.user.id !== data.authorId) {
        return next({
          status: 403,
          message: 'Forbidden',
        });
      }

      const isColorIdValid = isValidColorId(data.colorId);
      if (!isColorIdValid) {
        return next({
          status: 400,
          message: 'Invalid colorId',
        });
      }

      const calendarEntry = await prisma.calendarEntry.create({
        data: {
          ...data,
          groupId,
        },
      });

      return res.status(201).json(calendarEntry);
    } catch (error: any) {
      return next({
        message: error.message,
      });
    }
  },
};

export default calendarController;
