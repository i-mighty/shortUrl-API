import dotenv from 'dotenv'; 
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import multer from 'multer';
import cors from 'cors';

const upload = multer();

import './models/UrlShorten';

dotenv.config();

const DB = process.env.DB;
const DB_HOST = process.env.DB_HOST;

const dbURI = `mongodb://${DB_HOST}/${DB}`;
console.log(dbURI);
const connectOptions = {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  connectTimeoutMS: 10000,
  useNewUrlParser: true
};
//Connect to MongoDB
mongoose.Promise = global.Promise;
mongoose
  .connect(dbURI, connectOptions)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const app = express();
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.none()); 
app.use(cors());
app.options('*', cors());
require('./routes/urlShorten')(app);

app.listen(process.env.PORT, () => {
  console.log(`Server started on port`, process.env.PORT);
})

export default app;