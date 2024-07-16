// [ Package imports ]
import express from 'express';

// [ Local imports ]
import groupController from '../../controllers/groupController.js';

const router = express.Router();

/**
 * @route GET /api/me/group
 * @summary Get list of user groups
 * @group Group
 * @protected header {string} Authorization - Bearer token
 * @param {Object} req.user - User object added by loginRequired middleware
 * @param {string} req.user.email - Email of authenticated user
 * @returns {object[]} 200 - List of groups
 * @returns {Error}  401 - Unauthorized
 * @returns {Error}  404 - User not found
 */
router.get('/', groupController.getGroups);

/**
 * @route POST /api/me/group
 * @summary Create a new group
 * @group Group
 * @protected header {string} Authorization - Bearer token
 * @param {Object} req.user - User object added by loginRequired middleware
 * @param {string} req.user.email - Email of authenticated user
 * @param {object} req.body - name and colorId of the group
 * @returns {object} 201 - Created group
 * @returns {Error}  400 - Bad request
 * @returns {Error}  401 - Unauthorized
 */
router.post('/', groupController.createGroup);

export default router;
