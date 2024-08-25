import { CognitoJwtVerifier } from "aws-jwt-verify";
export const accessVerifier = CognitoJwtVerifier.create({
  userPoolId: process.env.AGENT_USER_POOL_ID!,
  tokenUse: "access",
  clientId: process.env.AGENT_USER_POOL_CLIENT_ID!
});
export const idTokenVerifier = CognitoJwtVerifier.create({
  userPoolId: process.env.AGENT_USER_POOL_ID!,
  tokenUse: "id",
  clientId: process.env.AGENT_USER_POOL_CLIENT_ID!
});


