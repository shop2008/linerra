import { Table, Entity, schema, string, number, prefix } from 'dynamodb-toolbox';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

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


export const MainTable = new Table({
  name: process.env.MAIN_TABLE!,
  partitionKey: { name: 'PK', type: 'string' },
  sortKey: { name: 'SK', type: 'string' },
  indexes: {
    GSI1: {
      type: 'global',
      partitionKey: { name: 'GSI1PK', type: 'string' },
      sortKey: { name: 'GSI1SK', type: 'string' },
    },
  },
  documentClient
});

export const AgentSession = new Entity({
  name: 'AgentSession',
  table: MainTable,
  schema: schema({
    userId: string().required().transform(prefix('AGENT')).savedAs('PK').key(),
    sessionId: string().required().transform(prefix('SESSION')).savedAs('SK').key(),
    refreshToken: string().required(),
    expirationTime: number().required(),
  }),
  // computeKey: ({ userId, sessionId }) => ({
  //   PK: userId,
  //   SK: sessionId,
  // }),
});
