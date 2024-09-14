import { Table, Entity, schema, string, number, prefix, map, list } from 'dynamodb-toolbox';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import Dicts from '../enum/dicts';
import { InitiationDO, DestinationDO } from '../models/veryk/address.entity';
import { PackageDO } from '../models/veryk/package.entity';
import { now } from '../utils/utils';

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
    GSI2: {
      type: 'global',
      partitionKey: { name: 'GSI2PK', type: 'string' },
      sortKey: { name: 'GSI2SK', type: 'string' },
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

export const Shipment = new Entity({
  name: 'Shipment',
  table: MainTable,
  // computeKey: ({ stationId }) => ({
  //   PK: 'STATION#' + stationId,
  //   SK: 'SHIPMENT#' + now(),
  //   //GSI1PK: "SHIPMENT_NO",
  //   //GSI1SK: number,
  // }),

  schema: schema({
    number: string().required().transform(prefix('SHIPMENT')).savedAs('PK').key(),
    SK: string().const("SHIPMENT").key().default("SHIPMENT"),
    stationId: string().required().transform(prefix('STATION')).savedAs('GSI1PK'),
    sortTimestamp: string().required().transform(prefix('SHIPMENT')).savedAs('GSI1SK'),
    //SK: string().transform(prefix('SHIPMENT')).savedAs('SK').key().default(now()),
    //created: string().default(now).key(),
    //aa: string().const("SHIPMENT_NO").key().savedAs('GSI1PK').required(),

    //GSI1PK: string().const("SHIPMENT_NO").key().default("SHIPMENT_NO"),


    GSI2PK: string().const("SHIPMENT").default("SHIPMENT"),
    //GSI2SK: string().required().transform(prefix('SHIPMENT')).savedAs('GSI2SK').key(),

    externalId: string().optional(),
    waybillNumber: string().optional(),
    serviceId: string().required(),
    status: string().enum(...Dicts.shipmentStatus.map(status => status.value)).required(),

    //initiationRegionId: string().optional(),
    //destinationRegionId: string().optional(),
    initiation: map({
      regionId: string().required(),
      postalCode: string().required(),
      name: string().optional(),
      company: string().optional(),
      phone: string().optional(),
      province: map({
        id: string().required(),
        name: string().required(),
        code: string().required(),
      }).optional(),
      city: string().optional(),
      address: string().optional(),
      address2: string().optional(),
      address3: string().optional(),
    }).required(),
    destination: map({
      regionId: string().required(),
      postalCode: string().required(),
      name: string().optional(),
      company: string().optional(),
      phone: string().optional(),
      province: map({
        id: string().required(),
        name: string().required(),
        code: string().required(),
      }).optional(),
      city: string().optional(),
      address: string().optional(),
      address2: string().optional(),
      address3: string().optional(),
      type: string().optional(),
      email: string().optional(),
    }).required(),

    package: map({
      type: string().required(),
      packages: list(map({
        waybillNumber: string().optional(),
        weight: number().required(),
        dimension: map({
          length: number().required(),
          width: number().required(),
          height: number().required(),
        }).required(),
        insurance: map({
          code: string().required(),
          symbol: string().required(),
          value: string().required(),
        }).required(),
      })).required(),
    }).required(),
    option: map({
      memo: string().optional(),
      packingFee: number().optional(),
    }).optional(),
    price: map({
      msrp: map({
        code: string().required(),
        symbol: string().required(),
        value: string().required(),
      }).optional(),
      details: list(map({
        code: string().required(),
        description: string().required(),
        price: map({
          code: string().required(),
          symbol: string().required(),
          value: string().required(),
        }).required(),
      })).optional(),
      charges: list(map({
        code: string().required(),
        description: string().required(),
        price: map({
          code: string().required(),
          symbol: string().required(),
          value: string().required(),
        }).required(),
      })).optional(),
    }).optional(),
    payments: list(map({
      dateTime: string().required(),
      description: string().required(),
      subtotal: map({
        code: string().required(),
        symbol: string().required(),
        value: string().required(),
      }).required(),
    })).optional(),
    total: map({
      code: string().required(),
      symbol: string().required(),
      value: string().required(),
    }).optional(),
    submittedAt: string().optional(),
  }).and(prevSchema => ({
    GSI2SK: string().required().link<typeof prevSchema>(
      ({ number }) => number
    ),
    initiationRegionId: string().required().link<typeof prevSchema>(
      ({ initiation }) => initiation.regionId
    ),
    destinationRegionId: string().required().link<typeof prevSchema>(
      ({ destination }) => destination.regionId
    ),
  })),
});
