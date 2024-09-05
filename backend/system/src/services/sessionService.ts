import { Table, Entity, schema, string, number, PutItemCommand, GetItemCommand, UpdateItemCommand } from 'dynamodb-toolbox';
import { v4 as uuidv4 } from 'uuid';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import AWS from 'aws-sdk'



const dynamoClient = process.env.IS_OFFLINE ? new DynamoDBClient({
  region: 'localhost',
  endpoint: `http://localhost:${process.env.LOCAL_DYNAMO_DB_PORT}`,
  credentials: {
    accessKeyId: 'MockAccessKeyId',
    secretAccessKey: 'MockSecretAccessKey'
  },
}) : new DynamoDBClient();
const documentClient = DynamoDBDocumentClient.from(dynamoClient, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertEmptyValues: false
  },
});
const UserSessionsTable = new Table({
  name: process.env.USER_SESSIONS_TABLE!,
  partitionKey: { name: 'userId', type: 'string' },
  sortKey: { name: 'sessionId', type: 'string' },
  documentClient
});

const UserSession = new Entity({
  name: 'UserSession',
  table: UserSessionsTable,
  schema: schema({
    userId: string().key(),
    sessionId: string().key(),
    refreshToken: string().required(),
    expirationTime: number().required(),
  }),
});

export class SessionService {
  public static instance: SessionService = new SessionService();

  async createSession(userId: string, refreshToken: string, expirationTime: number): Promise<string> {
    const sessionId = uuidv4();
    await UserSession.build(PutItemCommand).item({
      userId,
      sessionId,
      refreshToken,
      expirationTime
    }).send();
    return sessionId;
  }

  async getSession(userId: string, sessionId: string): Promise<any> {
    const { Item } = await UserSession.build(GetItemCommand).key({ userId, sessionId }).send();
    return Item;
  }

  async updateSessionLastUsed(userId: string, sessionId: string): Promise<void> {
    await UserSession.build(UpdateItemCommand).item({
      userId,
      sessionId,
    }).send();
  }


}

export const sessionService = new SessionService();
