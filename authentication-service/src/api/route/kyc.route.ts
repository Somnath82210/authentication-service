import express from 'express';
import {kyc,bankDetails, ondc, store} from '../controllers/kyc.controller'
import multer from 'multer';
let route = express.Router();

const upload = multer({ dest: 'public/uploads/' });

route.post('/', kyc);
route.post('/bankdetails',bankDetails)
route.post('/ondc', ondc)
route.post('/storetiming', store)
export default route;
