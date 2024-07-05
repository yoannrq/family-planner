// [ Package imports ]
import express from 'express';
// [ Local imports ]
import authController from '../controllers/authController.js';
const router = express.Router();
/**
 * @route POST /api/auth/signup
 * @summary Sign up a new user
 * @group Authentication
 * @param {string} name.body.required - Name of the user
 * @param {string} email.body.required - Email of the user
 * @param {string} password.body.required - Password of the user
 * @returns {object} 201 - User object
 * @returns {Error}  400 - Bad request
 * @returns {Error}  409 - Conflict, user already exists
 */
router.post('/signup', authController.signup);
/**
 * @route POST /api/auth/login
 * @summary Login an existing user
 * @group Authentication
 * @param {string} email.body.required - Email of the user
 * @param {string} password.body.required - Password of the user
 * @returns {object} 200 - User object with access and refresh tokens
 * @returns {Error}  400 - Bad request
 * @returns {Error}  401 - Invalid email or password
 */
router.post('/login', authController.login);
/**
 * @route POST /api/auth/new-access-token
 * @summary Get a new access token
 * @group Authentication
 * @param {string} req.body.refreshToken - Refresh token of the user
 * @returns {object} 200 - New access token
 * @returns {Error} 400 - Refresh token is required
 * @returns {Error} 401 - Invalid refresh token
 */
router.post('/new-access-token', authController.newAccessToken);
export default router;
