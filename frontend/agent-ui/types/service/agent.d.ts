// @ts-ignore
/* eslint-disable */

declare namespace API.Service {
  type SignInParams = {
    email: string;
    password: string;
  };
  type SignInResult = {
    success: boolean;
    data: {
      accessToken: string;
      idToken: string;
      sessionId: string;
      userId?: string;
    };
  };

  type SignUpParams = {
    email: string;
    password: string;
  };
  type SignUpResult = {
    success: boolean;
  };

  type RefreshTokenResult = {
    accessToken: string;
    idToken: string;
  };

  type GoogleSignInParams = {
    googleToken: string;
  };
}