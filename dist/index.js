import express from 'express';
import dotenv from 'dotenv';
import router from './routers/apiRouter.js';
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', router);
const PORT = process.env.PORT || 3000;
app.listen(process.env.PORT, () => {
    console.log(`🚀 Server listening at http://localhost:${PORT}/api`);
});
