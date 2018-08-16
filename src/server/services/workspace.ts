import moment from 'moment';
import rp from 'request-promise';
import logger from '../utils/logger';

const appId = process.env.APP_ID || '';
const appSecret = process.env.APP_SECRET || '';

export interface Annotation {
  spaceId: string;
  userId: string;
  messageId: string;
  type: string;
  content: string;
}

interface AuthToken {
  token: string;
  expiresAt: number;
}

class Workspace {
  private authToken: AuthToken;

  /**
   * Refresh an access token
   * https://developer.watsonwork.ibm.com/docs/api-reference/authenticate-as-an-app
   */
  private async refreshAccessToken() {
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

      // Save the token in memory
      this.authToken = {
        token: res.access_token,
        expiresAt: moment().valueOf() + res.expires_in * 1000,
      };
      logger.debug(this.authToken, 'Got an access token');
    } catch (err) {
      throw err;
    }
  }

  /**
   * Get an access token
   *
   * @returns token
   */
  private async getAccessToken(): Promise<string> {
    if (!this.authToken || this.authToken.expiresAt < moment().valueOf()) {
      await this.refreshAccessToken();
    }
    return this.authToken.token;
  }

  async postMessage(spaceId: string, text: string) {
    const options = {
      method: 'POST',
      uri: `https://api.watsonwork.ibm.com/v1/spaces/${spaceId}/messages`,
      headers: {
        Authorization: `Bearer ${this.getAccessToken()}`,
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
  }

  /**
   * Authorize application
   */
  async authorize() {
    await this.refreshAccessToken();
  }
}

const workspace = new Workspace();
export default workspace;
