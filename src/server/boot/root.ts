import bparser from 'body-parser';
import { createHmac } from 'crypto';
import { NextFunction, Request, Response, Router } from 'express';
import webhook from '../controllers/webhook';
import logger from '../utils/logger';
import { authorize } from '../services/workspace';

/**
 * Verify request signature
 *
 * @param req
 * @param res
 * @param buf
 */
const verify = (secret: string) => (req: Request, res: Response, buf: Buffer) => {
  if (
    req.get('X-OUTBOUND-TOKEN') !==
    createHmac('sha256', secret)
      .update(buf)
      .digest('hex')
  ) {
    const err: any = new Error('Invalid request signature');
    err.status = 401;
    throw err;
  }
};

/**
 * Handle webhook challenge request
 *
 * @param req
 * @param res
 * @param next
 */
const challenge = (secret: string) => (req: Request, res: Response, next: NextFunction) => {
  if (req.body.type === 'verification') {
    logger.debug(req.body, 'Got webhook verification challenge');
    const body = JSON.stringify({
      response: req.body.challenge,
    });
    res.set(
      'X-OUTBOUND-TOKEN',
      createHmac('sha256', secret)
        .update(body)
        .digest('hex'),
    );
    res.type('json').send(body);
    return;
  }
  next();
};

const root = async app => {
  const appId = process.env.APP_ID || '';
  const appSecret = process.env.APP_SECRET || '';
  const webhookSecret = process.env.WEBHOOK_SECRET || '';

  try {
    await authorize(appId, appSecret);
  } catch (err) {
    logger.fatal(err);
    process.exit(1);
  }

  const router: Router = app.loopback.Router();
  router.get('/', (req: Request, res: Response) => res.redirect('/healthy'));
  router.get('/healthy', app.loopback.status());
  router.post(
    '/webhook',
    bparser.json({
      type: '*/*',
      verify: verify(webhookSecret),
    }),
    challenge(webhookSecret),
    async (req, res) => {
      res.status(201).end();

      if (req.body.userId !== appId) {
        webhook(req.body);
      }
    },
  );
  app.use(router);
};

export default root;
