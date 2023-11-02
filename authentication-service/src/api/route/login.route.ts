import express from 'express';
import {loginController} from '../controllers/login.controller'
let routes = express.Router()

routes.post('/', loginController);

export default routes