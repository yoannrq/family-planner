// [ Package import ]
import express from 'express';

// [ Local import ]
import groupController from '../../controllers/groupController.js';

// Option mergeParams so that we can access params from the parent router (here groupId)
const router = express.Router({ mergeParams: true });

// [ Routes ]
/**
 * @route DELETE /api/me/group/{groupId}/user/{userId}
 * @summary Remove user from group
 * @group Group
 * @protected header {string} Authorization - Bearer token
 * @param {Object} req.user - User object added by loginRequired middleware
 * @param {number} req.user.id - Id of authenticated user
 * @param {string} req.user.email - Email of authenticated user
 * @param {string} req.params.groupId - Group id
 * @param {string} req.params.userId - User id to remove
 * @returns {Promise<Group>} 200 - Updated group
 * @returns {Error}  401 - Unauthorized
 * @returns {Error}  403 - Forbidden || You cannot remove yourself from a group you own, you should promote another user to owner first || You are the only user left in the group, you should delete the group instead
 * @returns {Error}  404 - User or Group not found || User is not in the group
 */
router.delete('/:userId', groupController.removeUserFromGroup);

/**
 * @route PATCH /api/me/group/{groupId}/user/{userId}
 * @summary Add user to group
 * @group Group
 * @protected header {string} Authorization - Bearer token
 * @param {Object} req.user - User object added by loginRequired middleware
 * @param {number} req.user.id - Id of authenticated user
 * @param {string} req.user.email - Email of authenticated user
 * @param {string} req.params.groupId - Group id
 * @param {string} req.params.userId - User id to add
 * @returns {Promise<GroupWithUsers>} 200 - Updated group
 * @returns {Error}  401 - Unauthorized
 * @returns {Error}  403 - Forbidden
 * @returns {Error}  404 - User not found || Group not found
 * @returns {Error}  409 - User is already in the group
 */
router.patch('/:userId', groupController.addUserToGroup);

export default router;
