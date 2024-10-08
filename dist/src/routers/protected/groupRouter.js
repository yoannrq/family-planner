// [ Package imports ]
import express from 'express';
// [ Local imports ]
import groupController from '../../controllers/groupController.js';
import contactRouter from './contactRouter.js';
const router = express.Router();
// [ Sub-routers ]
router.use('/:groupId/contact', contactRouter);
// [ Routes ]
/**
 * @route GET /api/me/group
 * @summary Get list of user groups
 * @group Group
 * @protected header {string} Authorization - Bearer token
 * @param {Object} req.user - User object added by loginRequired middleware
 * @param {string} req.user.email - Email of authenticated user
 * @returns {Promise<Group[]>} 200 - List of groups
 * @returns {Error}  401 - Unauthorized
 * @returns {Error}  404 - User not found
 */
router.get('/', groupController.getGroups);
/**
 * @route GET /api/me/group/{groupId}
 * @summary Get group by id with users
 * @group Group
 * @protected header {string} Authorization - Bearer token
 * @param {Object} req.user - User object added by loginRequired middleware
 * @param {string} req.user.email - Email of authenticated user
 * @param {string} req.params.groupId - Group id
 * @returns {Promise<Group & { users: User[] }>} 200 - Group with users
 * @returns {Error}  401 - Unauthorized
 * @returns {Error}  403 - Forbidden
 * @returns {Error}  404 - Group not found
 */
router.get('/:groupId', groupController.getGroupByIdWithUsers);
/**
 * @route POST /api/me/group
 * @summary Create a new group
 * @group Group
 * @protected header {string} Authorization - Bearer token
 * @param {Object} req.user - User object added by loginRequired middleware
 * @param {string} req.user.email - Email of authenticated user
 * @param {GroupInput} req.body - name, colorId and ownerId of the group
 * @returns {Promise<Group>} 201 - Created group
 * @returns {Error}  400 - Bad request
 * @returns {Error}  401 - Unauthorized
 * @returns {Error}  404 - User not found
 */
router.post('/', groupController.createGroup);
/**
 * @route PATCH /api/me/group/{groupId}
 * @summary Update group by id
 * @group Group
 * @protected header {string} Authorization - Bearer token
 * @param {Object} req.user - User object added by loginRequired middleware
 * @param {string} req.user.email - Email of authenticated user
 * @param {string} req.params.groupId - Group id
 * @param {Partial<GroupInput>} req.body - name, colorId and ownerId of the group
 * @returns {Promise<Group>} 200 - Updated group
 * @returns {Error}  400 - Bad request
 * @returns {Error}  401 - Unauthorized
 * @returns {Error}  403 - Forbidden
 * @returns {Error}  404 - User or Group not found
 */
router.patch('/:groupId', groupController.updateGroup);
export default router;
