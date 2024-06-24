// [ Package imports ]
import express from 'express';
import dotenv from 'dotenv';

// [ Local imports ]
import router from './routers/indexRouter.js';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}/api`);
});
