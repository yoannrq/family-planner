// [ Package imports ]
import express from 'express';

// [ Local imports ]
import groupRouter from './groupRouter.js';
import meController from '../../controllers/meController.js';
import { User } from '@prisma/client';
import { UserInput } from '../../utils/validations/userSchema.js';

const router = express.Router();

// [ Sub-routers ]
router.use('/group', groupRouter);

// [ Routes ]

/**
 * @route   PATCH /api/me
 * @summary Update user information
 * @group   Me
 * @protected header {string} Authorization - Bearer token
 * @param   {Object} req.user - User object added by loginRequired middleware
 * @param   {string} req.user.email - Email of authenticated user
 * @param   {UserInput} req.body - User information to update
 * @returns {Promise<User>} 200 - Updated user
 * @returns {Error}  401 - Unauthorized
 */
router.patch('/', meController.updateMe);

export default router;
