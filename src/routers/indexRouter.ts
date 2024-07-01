// [ Package imports ]
import express from 'express';

// [ Local imports ]
import clerkRouter from './clerkRouter.js';

const router = express.Router();

// [ Authentification ]
// NOTE: Not used anymore
//router.use('/auth', authRouter);

// [ Clerk ]
router.use('/clerk', clerkRouter);

router.get('/', (req, res) => {
  console.log('Welcome to the API');
  res.send('Welcome to the API');
});

export default router;
