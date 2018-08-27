import { Request, Response } from 'express';
import workspace from '../services/workspace';
import logger from '../utils/logger';

const appId = process.env.APP_ID || '';

/**
 * Handle a message-created event
 *
 * @param body
 */
const onMessageCreagted = (body: any) => {
  // Just send back the same message
  workspace.sendMessage(body.spaceId, body.content);
};

/**
 * Handle events sent from Watson Workspace
 *
 * @param req
 * @param res
 */
const webhook = async (req: Request, res: Response) => {
  res.status(201).end();

  if (req.body.userId === appId) {
    return;
  }
  logger.trace(req.body);

  switch (req.body.type) {
    case 'message-created':
      onMessageCreagted(req.body);
      break;
  }
};

export default webhook;
