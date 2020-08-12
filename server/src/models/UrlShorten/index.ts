import mongoose, {Schema} from 'mongoose';
import  mongoosePaginate from 'mongoose-paginate';
import { Url } from './types';
import { shortBaseUrl } from '@src/utils/constants';

const urlSchema: Schema = new Schema({
  originalUrl: String,
  urlCode: { type: String, unique: true },
  shortUrl: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

urlSchema.plugin(mongoosePaginate);

export default mongoose.model<Url>('Url', urlSchema, 'urls');
