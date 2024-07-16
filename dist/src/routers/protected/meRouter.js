// [ Package imports ]
import express from 'express';
// [ Local imports ]
import groupRouter from './groupRouter.js';
const router = express.Router();
router.use('/group', groupRouter);
export default router;
