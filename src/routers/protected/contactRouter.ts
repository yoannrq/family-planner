// [ Package imports ]
import express from 'express';

// [ Local imports ]
import contactController from '../../controllers/contactController.js';
import { ContactInput } from '../../utils/validations/contactSchema.js';
import { Contact } from '@prisma/client';

// Option mergeParams so that we can access params from the parent router (here groupId)
const router = express.Router({ mergeParams: true });

// [ Routes ]

/**
 * @route GET /api/me/group/:groupId/contact
 * @summary Get list of contacts in a group
 * @group Contact
 * @protected header {string} Authorization - Bearer token
 * @param {Object} req.user - User object added by loginRequired middleware
 * @param {string} req.user.email - Email of authenticated user
 * @param {string} req.params.groupId - Group ID
 * @returns {Promise<Contact[]>} 200 - List of contacts
 * @returns {Error}  401 - Unauthorized
 * @returns {Error}  403 - Forbidden
 */
router.get('/', contactController.getContacts);

/**
 * @route POST /api/me/group/:groupId/contact
 * @summary Create a contact
 * @group Contact
 * @protected header {string} Authorization - Bearer token
 * @param {Object} req.user - User object added by loginRequired middleware
 * @param {string} req.user.email - Email of authenticated user
 * @param {string} req.params.groupId - Group ID
 * @param {ContactInput} req.body - Contact object
 * @returns {Promise<Contact>} 201 - Created contact
 * @returns {Error}  400 - Bad request (validation error)
 * @returns {Error}  401 - Unauthorized
 * @returns {Error}  403 - Forbidden
 */
router.post('/', contactController.createContact);

/**
 * @route PATCH /api/me/group/:groupId/contact/:contactId
 * @summary Update a contact
 * @group Contact
 * @protected header {string} Authorization - Bearer token
 * @param {Object} req.user - User object added by loginRequired middleware
 * @param {string} req.user.email - Email of authenticated user
 * @param {string} req.params.groupId - Group ID
 * @param {string} req.params.contactId - Contact ID
 * @param {ContactInput} req.body - Contact object
 * @returns {Promise<Contact>} 200 - Updated contact
 * @returns {Error}  400 - Bad request (validation error)
 * @returns {Error}  401 - Unauthorized
 * @returns {Error}  403 - Forbidden
 * @returns {Error}  404 - Not found
 */
router.patch('/:contactId', contactController.updateContact);

export default router;
