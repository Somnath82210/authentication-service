import express from 'express';
import registerRouter from '../api/route/register.route'
import loginRouter from '../api/route/login.route'
import kycRouter from '../api/route/kyc.route'
let routes = express.Router()

routes.use('/register',registerRouter)
routes.use('/login',loginRouter)
routes.use('/kyc', kycRouter)
export default routes