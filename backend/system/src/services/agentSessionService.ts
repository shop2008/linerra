import { Table, Entity, schema, string, number, PutItemCommand, GetItemCommand, UpdateItemCommand } from 'dynamodb-toolbox';
import { v4 as uuidv4 } from 'uuid';
import { AgentSession } from '../dynamodb/toolbox';

export class AgentSessionService {
  public static instance: AgentSessionService = new AgentSessionService();

  async createSession(userId: string, refreshToken: string, expirationTime: number): Promise<string> {
    const sessionId = uuidv4();
    await AgentSession.build(PutItemCommand).item({
      userId,
      sessionId,
      refreshToken,
      expirationTime
    }).send();
    return sessionId;
  }

  async getSession(userId: string, sessionId: string): Promise<any> {
    const { Item } = await AgentSession.build(GetItemCommand).key({ userId, sessionId }).send();
    return Item;
  }

  async updateSessionLastUsed(userId: string, sessionId: string): Promise<void> {
    await AgentSession.build(UpdateItemCommand).item({
      userId,
      sessionId,
    }).send();
  }


}

export const agentSessionService = AgentSessionService.instance;
