// [ Package imports ]
import express from 'express';
// [ Local imports ]
import authRouter from './authRouter.js';
import loginRequired from '../middlewares/loginRequired.js';
import meRouter from './protected/meRouter.js';
import publicRouter from './publicRouter.js';
const router = express.Router();
// [ Authentification ]
router.use('/auth', authRouter);
// [ Public routes ]
router.use('/public', publicRouter);
// [ Protected by loginRequired middleware ]
router.use('/me', loginRequired, meRouter);
router.get('/', (req, res) => {
    console.log('Welcome to the API');
    res.send('Welcome to the API');
});
export default router;
