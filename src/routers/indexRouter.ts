// [ Package imports ]
import express from 'express';

// [ Local imports ]
import authRouter from './authRouter.js';

const router = express.Router();

// [ Authentification ]
router.use('/auth', authRouter);

router.get('/', (req, res) => {
  console.log('Welcome to the API');
  res.send('Welcome to the API');
});

export default router;
