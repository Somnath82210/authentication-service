import { Request, Response,NextFunction } from "express"
import { kycService } from "../../services/kyc.services"


export default async function kyc (req:Request,res:Response, next:NextFunction){
    try {
        let data= {


        }
        
        let services : any = await kycService(data)
        if (services.status){
            res.status(200).json({success:true, message:"kyc done", data:services.data})
        }
    } catch (error) {
        console.log("error in controller ", error)
    }
}