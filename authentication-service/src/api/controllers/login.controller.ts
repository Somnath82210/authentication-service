import { adminLevelCheck, loginService } from "../../services/login.services"
import { Request, Response, NextFunction } from "express"
import asyncError from "../../utils/asyncError"

export async function loginController(req:Request, res:Response, next:NextFunction){
    try {
        let data = {
            email:req.body.email,
            hashedPassword:req.body.password
        }
        let services :any = await loginService(data)
        if(services.status===true){
            res.status(200).json({success:true, message:"login success", token: services.data.token, email:services.data.email, statusCode:services.data.statusCode})
        } else if(services.status===false) {
            res.status(401).json({success:false, error:services.error})
        } 
    } catch (error) {
        console.log("from catch controller", error)
        res.status(500).json({success:false, error:"email or password missmatch"})
    }    
}

export async function adminLevelCheckController(req:Request, res:Response, next:NextFunction) {
    try {
        let token =  req.headers.authorization as string;
        let services: any =  await adminLevelCheck(token)
        if(services.status===true){
            res.status(200).json({success:true, message:services.message})
        } else if(services.status===false) {
            res.status(401).json({success:false, error:services.message})
        } else {
            console.log("internal server error")
            res.status(500).json({success:false, error:services.message})
        }
    } catch (error) {
        console.log("from catch controller", error)
        res.status(500).json({success:false, error:"admin find error"})
    }
}
