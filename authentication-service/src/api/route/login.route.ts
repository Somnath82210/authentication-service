import express from 'express';
import login from '../controllers/login.controller'
let routes = express.Router()

routes.post('/', login)

export default routes