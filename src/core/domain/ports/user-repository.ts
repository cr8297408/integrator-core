import { type User } from '../entities/user';

export interface UserRepositoryPort {
  save: (user: User) => Promise<void>;
  findByEmail: (email: string) => Promise<User | null>;
}
