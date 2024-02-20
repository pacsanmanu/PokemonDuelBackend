import app from './app.js';
import config from './config.js';
import start from './controllers/test-controller.js';

const { port } = config;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  start();
});
