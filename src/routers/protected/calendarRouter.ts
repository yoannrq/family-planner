// [ Package imports ]
import express from 'express';

// [ Local imports ]
import calendarController from '../../controllers/calendarController.js';
import { ContactInput } from '../../utils/validations/contactSchema.js';
import { CalendarEntry } from '@prisma/client';

// Option mergeParams so that we can access params from the parent router (here groupId)
const router = express.Router({ mergeParams: true });

// [ Routes ]

/**
 * @route GET /api/me/group/:groupId/calendar
 * @summary Get list of calendar entries in a group
 * @group Calendar
 * @protected header {string} Authorization - Bearer token
 * @param {Object} req.user - User object added by loginRequired middleware
 * @param {string} req.user.email - Email of authenticated user
 * @param {string} req.params.groupId - Group ID
 * @returns {Promise<CalendarEntry[]>} 200 - List of calendar entries
 * @returns {Error}  401 - Unauthorized
 * @returns {Error}  403 - Forbidden
 */
router.get('/', calendarController.getCalendarEntries);

/**
 * @route POST /api/me/group/:groupId/calendar
 * @summary Create a calendar entry in a group
 * @group Calendar
 * @protected header {string} Authorization - Bearer token
 * @param {Object} req.user - User object added by loginRequired middleware
 * @param {string} req.user.email - Email of authenticated user
 * @param {string} req.params.groupId - Group ID
 * @param {CalendarEntryInput} req.body - Calendar entry object
 * @returns {Promise<CalendarEntry>} 201 - Created calendar entry
 * @returns {Error}  400 - Bad request (validation error)
 * @returns {Error}  401 - Unauthorized
 * @returns {Error}  403 - Forbidden
 */
router.post('/', calendarController.createCalendarEntry);

export default router;
