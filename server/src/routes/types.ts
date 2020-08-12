import { PaginateResult } from "mongoose";
import { Url } from '../models/UrlShorten/types';

export interface GetUrlsRequest {
  limit: string;
  page: string;
}

export interface GetUrlsResponse {
  message: string;
  data?: PaginateResult<Url>;
}

export interface GetUrlRequest {
  originalUrl: string;
}

export interface GetUrlResponse {
  message: string;
  data?: Url
}