import express from 'express';
import kycController from '../controllers/kyc.controller'
let route = express.Router();

route.post('/', kycController);

export default route;
