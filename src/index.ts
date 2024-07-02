// [ Package imports ]
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// [ Local imports ]
import router from './routers/indexRouter.js';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();
const app = express();

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: 'http://localhost:5173', // L'URL du frontend
    credentials: true,
  }),
);

//TODO set cors options
app.options('*', cors());

app.use('/api', router);

app.get('/', (req, res) => {
  res.send('Test home');
});

//404 Handler
//TODO Améliorer la route 404
app.use((req, res, next) => {
  res.status(404).send("Désolé, cette route n'existe pas !");
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}/api`);
});
