// [ Package imports ]
import express from 'express';

// [ Local imports ]
import colorRouter from './public/colorRouter.js';

const router = express.Router();

// [ Sub-routers ]
router.use('/color', colorRouter);

export default router;
