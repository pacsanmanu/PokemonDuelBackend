import express from 'express';
import cors from 'cors';
import init from './loaders/index.js';
import config from './config.js';

const app = express();

const corsOptions = {
  origin: ['http://localhost:3001', 'https://projectfrontend-cv1n.onrender.com', 'https://pkmnduel.vercel.app/'],
};

app.use(cors(corsOptions));

init(app, config);

export default app;
