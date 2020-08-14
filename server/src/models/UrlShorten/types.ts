import { Document } from "mongoose";

export interface Url extends Document {
  originalUrl: string;
  urlCode: string;
  shortUrl: string;
  createdAt: string
  updatedAt: string;
  user:{
    ref:string,
    type:string
  }
}