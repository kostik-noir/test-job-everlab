import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import * as abnormalObservationsRouter from './routes/abnormal-observations';

dotenv.config();

(async () => {
  const app: Express = express();

  app.use((req: Request, res: Response, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.use('/', abnormalObservationsRouter.create());

  const port = 3000;
  app.listen(port, () => {
    console.log(`App listening on port ${port}`)
  });
})();
