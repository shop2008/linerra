import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  SignUpCommandOutput,
  GetUserCommand,
  ListUsersCommand,
  AdminCreateUserCommand,
  AdminInitiateAuthCommand,
  AdminSetUserPasswordCommand,
  AdminUpdateUserAttributesCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import logger from '../utils/logger';
import { SessionService } from './sessionService';
import { OAuth2Client } from 'google-auth-library';

const client = new CognitoIdentityProviderClient({
  region: process.env.AGENT_USER_POOL_REGION || process.env.AWS_REGION,
});

export class CognitoService {
  private userPoolId: string;
  private clientId: string;
  private domain: string;
  private userPool: CognitoUserPool;
  private sessionService: SessionService;
  private googleClient: OAuth2Client;
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
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
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
    //console.log(email, password);
    console.log(
      process.env.AGENT_USER_POOL_ID,
      process.env.AGENT_USER_POOL_CLIENT_ID
    );
    return new Promise((resolve, reject) => {
      const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      });
      console.log(authenticationDetails);
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
          const after30Days = new Date(
            new Date().getTime() + 30 * 24 * 60 * 60 * 1000
          );
          const sessionId = await this.sessionService.createSession(
            userId,
            idToken,
            Math.floor(after30Days.getTime() / 1000)
          );

          resolve({ idToken, accessToken, userId, sessionId });
        },
        onFailure: (err) => {
          logger.error('Error signing in user', { email, error: err });
          reject(err);
        },
      });
    });
  }

  async signInWithGoogle(token: string): Promise<any> {
    try {
      console.log('Attempting to sign in with Google');

      let googleUserInfo;
      if (token.startsWith('ya29.')) {
        // This is likely an access token, not an ID token
        console.log(
          'Received access token instead of ID token. Fetching user info...'
        );
        googleUserInfo = await this.fetchGoogleUserInfo(token);
      } else {
        // Assume this is an ID token and try to verify it
        googleUserInfo = await this.verifyGoogleToken(token);
      }

      console.log('Google user info:', JSON.stringify(googleUserInfo, null, 2));

      const { email, sub: googleId } = googleUserInfo;

      let cognitoUser;
      let isNewUser = false;
      try {
        cognitoUser = await this.getUserByEmail(email);
        // Check if the user has a Google ID attribute
        const hasGoogleId = cognitoUser.Attributes?.some(
          (attr: { Name: string; Value: string }) =>
            attr.Name === 'custom:googleId' && attr.Value === googleId
        );

        if (!hasGoogleId) {
          // Update the user with the Google ID
          await this.updateUserGoogleId(email, googleId);
        }
      } catch (error) {
        // User doesn't exist, create a new account
        await this.createUserForGoogleSignIn(email, googleId);
        isNewUser = true;
      }

      // Sign in the user
      return this.adminSignInGoogle(email, isNewUser);
    } catch (error) {
      console.error('Error in signInWithGoogle:', error);
      throw error;
    }
  }

  private async updateUserGoogleId(
    email: string,
    googleId: string
  ): Promise<void> {
    const command = new AdminUpdateUserAttributesCommand({
      UserPoolId: this.userPoolId,
      Username: email,
      UserAttributes: [{ Name: 'custom:googleId', Value: googleId }],
    });

    await client.send(command);
  }

  private async adminSignInGoogle(
    email: string,
    isNewUser: boolean
  ): Promise<any> {
    console.log('adminSignInGoogle', email, isNewUser);
    if (isNewUser) {
      // For new users, set a random password and use ADMIN_USER_PASSWORD_AUTH
      const tempPassword = this.generateRandomPassword();
      await this.setUserPassword(email, tempPassword);
      return this.adminUserPasswordAuth(email, tempPassword);
    } else {
      // For existing users, use ADMIN_NO_SRP_AUTH
      const command = new AdminInitiateAuthCommand({
        UserPoolId: this.userPoolId,
        ClientId: this.clientId,
        AuthFlow: 'ADMIN_NO_SRP_AUTH',
        AuthParameters: {
          USERNAME: email,
        },
      });

      const response = await client.send(command);
      return response.AuthenticationResult;
    }
  }

  private async setUserPassword(
    email: string,
    password: string
  ): Promise<void> {
    const command = new AdminSetUserPasswordCommand({
      UserPoolId: this.userPoolId,
      Username: email,
      Password: password,
      Permanent: true,
    });
    await client.send(command);
  }

  private async adminUserPasswordAuth(
    email: string,
    password: string
  ): Promise<any> {
    const command = new AdminInitiateAuthCommand({
      UserPoolId: this.userPoolId,
      ClientId: this.clientId,
      AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    const response = await client.send(command);
    return response.AuthenticationResult;
  }

  private async verifyGoogleToken(token: string): Promise<any> {
    try {
      console.log('token', token);
      console.log('GOOGLE_CLIENT_ID', process.env.GOOGLE_CLIENT_ID);
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      console.log('Token verified successfully');

      const payload = ticket.getPayload();
      if (!payload) {
        console.error('Token payload is empty');
        throw new Error('Invalid Google token payload');
      }

      console.log('Token payload:', JSON.stringify(payload, null, 2));

      return payload;
    } catch (error) {
      console.error('Error verifying Google token:', error);
      if (error instanceof Error) {
        logger.error('Error verifying Google token', {
          error: error.message,
          stack: error.stack,
        });
      } else {
        logger.error('Unknown error verifying Google token', { error });
      }
      throw new Error('Invalid Google token');
    }
  }

  private async fetchGoogleUserInfo(accessToken: string): Promise<any> {
    try {
      const response = await fetch(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching Google user info:', error);
      throw error;
    }
  }

  private async getUserByEmail(email: string): Promise<any> {
    const params = {
      UserPoolId: this.userPoolId,
      Filter: `email = "${email}"`,
      Limit: 1,
    };

    try {
      const command = new ListUsersCommand(params);
      const response = await client.send(command);
      console.log('getUserByEmail response', response);
      if (response.Users && response.Users.length > 0) {
        return response.Users[0];
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      logger.error('Error getting user by email', { email, error });
      throw error;
    }
  }

  private async createUserForGoogleSignIn(
    email: string,
    googleId: string
  ): Promise<void> {
    const command = new AdminCreateUserCommand({
      UserPoolId: this.userPoolId,
      Username: email,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'email_verified', Value: 'true' },
        { Name: 'custom:googleId', Value: googleId },
      ],
      MessageAction: 'SUPPRESS',
    });

    await client.send(command);
  }

  private generateRandomPassword(): string {
    const length = 16;
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const symbols = '!@#$%^&*()_+';
    let password = '';

    // Ensure at least one symbol
    password += symbols.charAt(Math.floor(Math.random() * symbols.length));

    // Fill the rest of the password
    for (let i = 1; i < length; i++) {
      const useSymbol = Math.random() < 0.2; // 20% chance for a symbol
      const charSet = useSymbol ? symbols : charset;
      password += charSet.charAt(Math.floor(Math.random() * charSet.length));
    }

    return password;
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

  async handleTokenRefresh(
    userId: string,
    sessionId: string,
    accessToken: string,
    idToken: string
  ): Promise<any> {
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
