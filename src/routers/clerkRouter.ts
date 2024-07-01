// [ Package imports ]
import express from 'express';

// [ Local imports ]
import clerkController from '../controllers/clerkController.js';

const router = express.Router();

/**
 * @route POST /api/clerk/webhook
 * @summary Webhook for Clerk
 * @group Clerk
 * @param {string} type.body.required - Type of the event
 * @param {object} data.body.required - Data of the event
 * @returns {object} 200 - Updated
 * @returns {object} 201 - Created
 * @returns {object} 400 - Bad Request
 * @returns {object} 404 - User not found
 * @returns {object} 409 - User already exists
 */
router.post('webhook', clerkController.webhook);

export default router;
