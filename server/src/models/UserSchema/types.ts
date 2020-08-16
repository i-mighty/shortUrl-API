import { Document } from 'mongoose';

export interface User extends Document {
  username: string;
  hashedPassword: string;
  salt: string;
  updated: string;
  authenticate: (arg: string) => boolean;
  makeSalt: () => string;
  encryptPassword: (arg: string) => string;
  _password: string;
}
