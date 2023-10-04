import express from 'express';
import register from '../controllers/register.controller'
let routes = express.Router()

routes.post('/', register)

export default routes