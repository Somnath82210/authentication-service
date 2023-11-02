import express from 'express';
import {kyc,bankDetails, ondc, store} from '../controllers/kyc.controller'
let route = express.Router();

route.post('/', kyc);
route.post('/bankdetails',bankDetails)
route.post('/ondc', ondc)
route.post('/storetiming', store)
export default route;
