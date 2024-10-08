// [ Package imports ]
import express from 'express';
// [ Local imports ]
import authController from '../controllers/authController.js';
const router = express.Router();
/**
 * @route POST /api/auth
 * @summary Sign up a new user
 * @group Authentification
 * @param {string} name.body.required - Name of the user
 * @param {string} email.body.required - Email of the user
 * @param {string} password.body.required - Password of the user
 * @returns {object} 201 - User object
 * @returns {Error}  400 - Bad request
 * @returns {Error}  409 - Conflict, user already exists
 */
router.post('/signup', authController.signup);
export default router;
