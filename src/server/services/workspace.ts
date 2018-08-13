import rp, { RequestPromise } from 'request-promise';
import logger from '../utils/logger';

export interface Annotation {
  spaceId: string;
  userId: string;
  messageId: string;
  type: string;
  content: string;
}

let accessToken: string;

/**
 * Refresh an access token
 * https://developer.watsonwork.ibm.com/docs/api-reference/authenticate-as-an-app
 *
 * @param appId
 * @param appSecret
 */
const refreshToken = async (appId: string, appSecret: string) => {
  try {
    const options = {
      method: 'POST',
      uri: 'https://api.watsonwork.ibm.com/oauth/token',
      auth: {
        user: appId,
        pass: appSecret,
      },
      form: {
        grant_type: 'client_credentials',
      },
      json: true,
    };
    const res = await rp(options);
    if (res.error) {
      throw res.error;
    }
    logger.debug(res, 'Got an access token');

    // Schedule next refresh a bit before the token expires
    const timeout: any = setTimeout(
      refreshToken.bind(null, appId, appSecret),
      res.expires_in * 1000,
    );
    timeout.unref();

    // Save the token in memory
    accessToken = res.access_token;
  } catch (err) {
    throw err;
  }
};

/**
 * Authorize the application
 *
 * @param appId
 * @param appSecret
 */
export const authorize = async (appId: string, appSecret: string) =>
  // Obtain an initial token
  refreshToken(appId, appSecret);

/**
 * Post a message to a space
 * https://developer.watsonwork.ibm.com/docs/message/send-a-message-into-a-conversation
 *
 * @param spaceId
 * @param text
 */
export const postMessage = async (spaceId: string, text: string) => {
  const options = {
    method: 'POST',
    uri: `https://api.watsonwork.ibm.com/v1/spaces/${spaceId}/messages`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: {
      type: 'appMessage',
      version: 1.0,
      annotations: [
        {
          text,
          type: 'generic',
          version: 1.0,
        },
      ],
    },
    json: true,
  };

  try {
    await rp(options);
  } catch (err) {
    logger.error(err);
  }
};
