// [ Package imports ]
import express from 'express';

// [ Local imports ]
import colorController from '../../controllers/colorController.js';

const router = express.Router();

router.get('/', colorController.getColors);

export default router;
