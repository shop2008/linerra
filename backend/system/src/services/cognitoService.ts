import { CognitoIdentityProviderClient, SignUpCommand, InitiateAuthCommand, SignUpCommandOutput, GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import logger from "../utils/logger";
import { SessionService } from "./sessionService";

const client = new CognitoIdentityProviderClient({ region: process.env.AGENT_USER_POOL_REGION || process.env.AWS_REGION });

export class CognitoService {
  private userPoolId: string;
  private clientId: string;
  private domain: string;
  private userPool: CognitoUserPool;
  private sessionService: SessionService;
  public static instance: CognitoService = new CognitoService();

  constructor() {
    this.userPoolId = process.env.AGENT_USER_POOL_ID!;
    this.clientId = process.env.AGENT_USER_POOL_CLIENT_ID!;
    this.domain = `https://${process.env.AGENT_USER_POOL_DOMAIN}.auth.${process.env.AWS_REGION}.amazoncognito.com`;
    this.userPool = new CognitoUserPool({
      UserPoolId: process.env.AGENT_USER_POOL_ID!,
      ClientId: process.env.AGENT_USER_POOL_CLIENT_ID!,
    });
    this.sessionService = SessionService.instance;
  }

  async signUp(email: string, password: string) {
    const command = new SignUpCommand({
      ClientId: this.clientId,
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
      ],
    });

    try {
      const response: SignUpCommandOutput = await client.send(command);
      logger.info('User signed up successfully', { email });
      return response;
    } catch (error) {
      logger.error('Error signing up user', { email, error });
      throw error;
    }
  }

  // async signIn(email: string, password: string) {
  //   const command = new InitiateAuthCommand({
  //     AuthFlow: 'USER_SRP_AUTH',
  //     ClientId: this.clientId,
  //     AuthParameters: {
  //       USERNAME: email,
  //       PASSWORD: password,
  //     },
  //   });

  //   try {
  //     const response = await client.send(command);
  //     return response.AuthenticationResult;
  //   } catch (error) {
  //     logger.error('Error signing in user', { email, error });
  //     throw error;
  //   }
  // }
  signIn(email: string, password: string): Promise<any> {
    console.log(email, password);
    //console.log(process.env.AGENT_USER_POOL_ID, process.env.AGENT_USER_POOL_CLIENT_ID);
    return new Promise((resolve, reject) => {
      const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      });
      //console.log(authenticationDetails);
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: this.userPool,
      });

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: async (result) => {
          logger.info('User signed in successfully', { email });
          const idToken = result.getIdToken().getJwtToken();
          const accessToken = result.getAccessToken().getJwtToken();
          const userId = result.getIdToken().payload.sub;
          const after30Days = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000);
          const sessionId = await this.sessionService.createSession(userId, idToken, Math.floor(after30Days.getTime() / 1000));

          resolve({ idToken, accessToken, userId, sessionId });

        },
        onFailure: (err) => {
          logger.error('Error signing in user', { email, error: err });
          reject(err);
        },
      });
    });
  }

  async refreshTokens(refreshToken: string): Promise<any> {
    const command = new InitiateAuthCommand({
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      ClientId: this.clientId,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    });

    try {
      const response = await client.send(command);
      return response.AuthenticationResult;
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      throw error;
    }
  }

  async handleTokenRefresh(userId: string, sessionId: string, accessToken: string, idToken: string): Promise<any> {
    const session = await this.sessionService.getSession(userId, sessionId);
    if (!session || session.expirationTime < Math.floor(Date.now() / 1000)) {
      throw new Error('Session expired or not found');
    }

    const tokens = await this.refreshTokens(session.refreshToken);
    await this.sessionService.updateSessionLastUsed(userId, sessionId);

    return {
      accessToken: tokens.AccessToken,
      idToken: tokens.IdToken,
    };
  }

  async getUser(accessToken: string) {
    const command = new GetUserCommand({
      AccessToken: accessToken,
    });

    try {
      const response = await client.send(command);
      return response;
    } catch (error) {
      logger.error('Error getting user', { accessToken, error });
      throw error;
    }
  }
}
