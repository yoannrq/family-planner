// [ Package imports ]
import { Request, Response, NextFunction } from 'express';

// [ Local imports ]
import prisma from '../models/client.js';
import { CalendarEntry } from '@prisma/client';
import canAccessToGroup from '../utils/canAccessToGroup.js';

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
};

export default calendarController;
