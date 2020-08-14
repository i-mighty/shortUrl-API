import { PaginateResult } from "mongoose";
import { Url } from '../models/UrlShorten/types';
import {Request} from "express"

export interface GetUrlsRequest extends Request {
  limit: string;
  page: string;
  auth:{
    _id:string,
    iat:number
  }
}

export interface GetUrlsResponse {
  message: string;
  data?: PaginateResult<Url>;
}

export interface GetUrlRequest {
  originalUrl: string;
  auth:{
    _id:string,
    iat:number
  }
}

export interface GetUrlResponse {
  message: string;
  data?: Url
}
export interface GetUserCreateRequest {
  username:string;
  password:string
}
export interface GetUserCreateResponse { 
  message:string;
  token?:string;
}

export interface LoginRequest { 
  username:string,
  password:string
}
interface UserResponse{ 
  username:string
}
export interface LoginResponse { 
  token?:string,
  user?:UserResponse,
  error?:string
}