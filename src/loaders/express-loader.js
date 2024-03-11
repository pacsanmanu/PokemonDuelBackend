import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import path from 'path';
import YAML from 'yamljs';
import morganMiddleware from '../config/morgan.js';
import errorMiddleware from '../middlewares/error-middleware.js';
import router from '../routes/index.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const swaggerDocument = YAML.load(path.join(dirname, '../openapi/openapi.yml'));

export default function expressLoader(server) {
  // CONFIG
  server.use(express.json());
  server.use(express.urlencoded());
  // MDW
  server.use(morganMiddleware);
  // RUTAS
  server.use(router);
  // ERRORS
  server.use(errorMiddleware);
  server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
