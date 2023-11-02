import express from 'express';
import {register,userAdminController} from '../controllers/register.controller'
let routes = express.Router()

routes.post('/', register)
routes.post('/useradmin',userAdminController)

export default routes