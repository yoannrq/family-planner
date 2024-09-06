// [ Package imports ]
import express from 'express';
// [ Local imports ]
import colorController from '../../controllers/colorController.js';
const router = express.Router();
// [ Routes ]
/**
 * @route GET /api/public/color
 * @summary Get an array with all colors
 * @group Color
 * @public
 * @returns {Promise<Color[]>} 200 - Array with all colors
 */
router.get('/', colorController.getColors);
export default router;
