// [ Package imports ]
import express from 'express';
// [ Local imports ]
import authRouter from './authRouter.js';
const router = express.Router();
router.get('/', (req, res) => {
    res.send('Welcome to the API');
});
// [ Authentification ]
router.use('/auth', authRouter);
export default router;
