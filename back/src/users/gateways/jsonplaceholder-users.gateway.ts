import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { UsersGateway } from './users.gateway';
import { ExternalUser } from '../user.types';

@Injectable()
export class JsonPlaceholderUsersGateway implements UsersGateway {
  
  async fetchAll(): Promise<ExternalUser[]> {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    return response.data;
  }

  async fetchById(id: number): Promise<ExternalUser | null> {
    try {
      const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return null;
        }
      }
      throw error;
    }
  }
}