import express from 'express';
import {getUserSettingsController, register,updateUserController,userAdminController} from '../controllers/register.controller'
let routes = express.Router()
import multer from 'multer';
let upload = multer({dest:'public/uploads/'});
routes.post('/', register);
routes.post('/useradmin',userAdminController);
routes.get('/settings', getUserSettingsController);
routes.put('/updatesettings', upload.any(), updateUserController);

export default routes