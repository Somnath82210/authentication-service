import { loginService } from "../../services/login.services"
import { Request, Response, NextFunction } from "express"
import asyncError from "../../utils/asyncError"

export default async function login(req:Request, res:Response, next:NextFunction){
    try {
        let data = {
            email:req.body.email,
            hashedPassword:req.body.password
        }
        let services :any = await loginService(data)
        if(services.status){
            res.status(200).json({success:true, message:"login success", token: services.data})
        } else {
            res.status(401).json({success:false, error:services.error})
        }
    } catch (error) {
        console.log("from catch controller", error)
        res.status(500).json({success:false, error:"email or password missmatch"})
    }    
 
}
