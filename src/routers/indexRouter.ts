// [ Package imports ]
import express from 'express';

// [ Local imports ]
import authRouter from './authRouter.js';
import loginRequired from '../middlewares/loginRequired.js';
import meRouter from './meRouter.js';

const router = express.Router();

// [ Authentification ]
router.use('/auth', authRouter);

// [ Protected by loginRequired middleware ]
router.use('/me', loginRequired, meRouter);

router.get('/', (req, res) => {
  console.log('Welcome to the API');
  res.send('Welcome to the API');
});

export default router;
