import mongoose from 'mongoose';
import supertest from 'supertest';
import {initDB, destroyDB} from '../utils/test-utils';
import app from '..';
import { nanoid } from 'nanoid';
import { shortBaseUrl } from '../utils/constants';

const request = supertest(app);

const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbName = 'test-db';
const url = `mongodb://${dbHost}/${dbName}`;

beforeAll(async () => {
  await initDB();
  await mongoose.connect(url, { useNewUrlParser: true })
})

afterAll(async () => {
  await destroyDB();
  await mongoose.disconnect();

  await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
})

describe('Sample Test', () => {
  it('should get the list of all urls', async (done) => {
    const res = await request.post('/urls');
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('success');
    expect(res.body.data.page).toBe(1);
    expect(res.body.data.limit).toBe(10);
    done()
  });

  it('should get the list of all urls with the right limit and page', async (done) => {
    const limit = 20, page = 3;
    const res = await request.post('/urls').send({limit, page});
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('success');
    expect(res.body.data.page).toBe(page);
    expect(res.body.data.limit).toBe(limit);
    done();
  });

  it('create a new shortened url for original url', async (done) => {
    const originalUrl = `https://www.${nanoid(128)}.com`;
    const res = await request.post('/url').send({originalUrl})
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('success');
    done();
  });

  it('short url is of the right format', async (done) => {
    const originalUrl = `https://www.${nanoid(128)}.com`;
    const res = await request.post('/url').send({ originalUrl });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('success');
    const shortUrl: string = res.body.data.shortUrl;
    const shortUrlArray = shortUrl.split('/');
    expect(shortUrl).toContain(shortBaseUrl)
    expect(shortUrlArray.pop()).toHaveLength(8)
    done();
  })
});