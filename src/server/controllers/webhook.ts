import { Annotation, postMessage } from '../services/workspace';
import logger from '../utils/logger';

/**
 * Handle a message-created event
 *
 * @param ann
 */
const onMessageCreagted = (ann: Annotation) => {
  // Just send back the same message
  postMessage(ann.spaceId, ann.content);
};

/**
 * Handle events sent from Watson Workspace
 * @param ann
 */
const webhook = async (ann: Annotation) => {
  logger.trace(ann);

  switch (ann.type) {
    case 'message-created':
      onMessageCreagted(ann);
  }
};

export default webhook;
