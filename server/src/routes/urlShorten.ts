import mongoose, { PaginateResult } from 'mongoose';
import {Express} from 'express';
import validUrl from 'valid-url';
import { Url } from '../models/UrlShorten/types';
import { shortBaseUrl, shortUrlAlphabet } from '../utils/constants';
import { customAlphabet } from 'nanoid';
import {
  GetUrlsRequest,
  GetUrlsResponse,
  GetUrlResponse,
  GetUrlRequest,
  ItoBeSaved
} from './types';
import middleware from "../utils/middleware"

const Url = mongoose.model<Url>('Url');

const nanoid = customAlphabet(shortUrlAlphabet, 8);


module.exports = function (app: Express) {
  app.get('/', async (req, res) => {
    res.send("welcome to url shortener")
  });

  app.get('/:code', async (req, res) => {
    const urlCode = req.params.code;
    const item = await Url.findOne({ urlCode });
    if (item) {
      return res.redirect(item.originalUrl);
    } else {
      return res.status(404).json({
        message: 'Not found'
      });
    }
  });

  app.post<{}, GetUrlResponse, GetUrlRequest>('/url',middleware.addAuth, async (req, res) => {
    const { originalUrl } = req.body;
    const updatedAt = new Date();
    const queryOptions = { originalUrl };
    if (validUrl.isUri(originalUrl)) {
      let urlData;
      let shortUrl;
      try {
        if (!urlData) {
          urlData = await Url.findOne(queryOptions);
        }
        if (urlData) {
          res.status(200).json({
            message: 'success',
            data: urlData,
          });
        } else {
          const urlCode = nanoid();
          shortUrl = `${shortBaseUrl}/${urlCode}`;
          let itemToBeSaved:ItoBeSaved = { originalUrl, shortUrl, urlCode, updatedAt};
          if(req.body.auth){
            itemToBeSaved.user = req.body.auth._id
          }          
          console.log("item to be saved",itemToBeSaved)
          const item = new Url(itemToBeSaved);
          await item.save();
          res.status(200).json({
            message: 'success',
            data: item
          });
        }
      } catch (err) {
        console.log("there's an err",err)
        res.status(401).json({
          message: 'Some error occurred.'
        });
      }
    } else {
      return res.status(401).json({
        message: 'Invalid Original Url.'
      });
    }
  });

  app.post<{}, GetUrlsResponse, GetUrlsRequest>('/urls',middleware.addAuth, async (req, res) => {
    const limit = parseInt(req.body.limit || '10');
    const page = parseInt(req.body.page || '1');
    try {
      let urlsPage;
      if(req.body.auth){
        urlsPage = await Url.paginate({user:req.body.auth._id},{limit,page})     
      }else{
        urlsPage = await Url.paginate({user:undefined}, { limit, page });
      }
      if (urlsPage.docs) {
        res.status(200).json({
          message: `success`,
          data: urlsPage,
        })
      } else {
        res.status(300).json({
          message: `No urls yet`
        })
      }
    } catch (error) {
      console.log(error)
      return res.status(401).json({
        message: `Couldn't fetch the shortened urls.`
      })
    }
  })
  app.get('/error/not-found', async (req, res) => {
    res.status(200).json({
      message: 'success',
      data: 'URL not found'
    })
  });
}