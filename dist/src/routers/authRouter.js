// [ Package imports ]
import express from 'express';
// [ Local imports ]
import authController from '../controllers/authController.js';
const router = express.Router();
// [ Routes ]
/**
 * @route POST /api/auth/signup
 * @summary Sign up a new user
 * @group Authentication
 * @param {object} req.body - Request body
 * @param {string} req.body.name - Name of the user
 * @param {string} req.body.email - Email of the user
 * @param {string} req.body.password - Password of the user
 * @returns {Promise<User>} 201 - User object
 * @returns {Error}  400 - Bad request
 * @returns {Error}  409 - Conflict, user already exists
 */
router.post('/signup', authController.signup);
/**
 * @route POST /api/auth/login
 * @summary Login an existing user
 * @group Authentication
 * @param {object} req.body - Request body
 * @param {string} req.body.email - Email of the user
 * @param {string} req.body.password - Password of the user
 * @returns {Promise<User & accessToken: string>} 200 - User object with access and refresh tokens
 * @returns {Error}  400 - Bad request
 * @returns {Error}  401 - Invalid email or password
 */
router.post('/login', authController.login);
/**
 * @route POST /api/auth/new-access-token
 * @summary Get a new access token
 * @group Authentication
 * @param {object} req.body - Request body
 * @param {string} req.body.refreshToken - Refresh token of the user
 * @returns {Promise<{accessToken: string}>} 200 - New access token
 * @returns {Error} 400 - Refresh token is required
 * @returns {Error} 401 - Invalid refresh token
 */
router.post('/new-access-token', authController.newAccessToken);
export default router;
