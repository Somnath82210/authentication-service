import express from 'express';
import registerRouter from '../api/route/register.route'
import loginRouter from '../api/route/login.route'
import kycRouter from '../api/route/kyc.route'
import multer from 'multer';
let routes = express.Router()


const upload = multer({ dest: 'public/uploads/' });

routes.use('/register',registerRouter)
routes.use('/login',loginRouter)
routes.use('/kyc',
upload.any(), kycRouter)
export default routes