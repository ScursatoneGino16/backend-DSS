import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { UsersGateway } from './users.gateway';
import { ExternalUser } from '../user.types';

@Injectable()
export class LocalUsersGateway implements UsersGateway {
  private readonly filePath = path.join(process.cwd(), 'src/users/data/users.json');

  async fetchAll(): Promise<ExternalUser[]> {
    const data = await fs.readFile(this.filePath, 'utf-8');
    return JSON.parse(data);
  }

  async fetchById(id: number): Promise<ExternalUser | null> {
    const users = await this.fetchAll();
    const user = users.find((u) => u.id === id);
    return user || null;
  }
}