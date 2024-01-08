import { Request, Response,NextFunction } from "express"
import { kycService,bankDetailsAdd,ondcAdd,storeTiming } from "../../services/kyc.services"


export async function kyc (req:Request,res:Response, next:NextFunction){
    try {
        let data:object= req.body;
        let file = req.files;
        let userToken = req.headers.authorization;
        let services : any = await kycService(data, file,userToken)
        if (services.status){
            res.status(200).json({success:true, message:services.message, data:services.data})
        } else {
            res.status(404).json({success:false, error:services.message,data:services.data})
        }
    } catch (error) {
        console.log("error in controller ", error)
        res.status(500).json({success:false, error:"error from kyc controller which means Server error"})
    }
}

export async function bankDetails(req:Request,res:Response, next:NextFunction) {
    try {
        let data:object= req.body;
        let userToken = req.headers.authorization;
        let services : any = await bankDetailsAdd(data,userToken)
        if (services.status){
            res.status(200).json({success:true, message:services.message, data:services.data})
        } else {
            res.status(404).json({success:true, error:services.message,data:services.data})
        }
    } catch (error) {
        console.log("error in controller ", error)
        res.status(500).json({success:false, error:"error from kyc controller which means Server error"})
    }
}
export async function ondc(req:Request,res:Response, next:NextFunction) {
    try {
        let data:object= req.body;
        let userToken = req.headers.authorization
        let services : any = await ondcAdd(data,userToken)
        if (services.status){
            res.status(200).json({success:true, message:services.message, data:services.data})
        } else {
            res.status(404).json({success:true, error:services.message,data:services.data})
        } 
    } catch (error) {
        console.log("error in controller ", error)
        res.status(500).json({success:false, error:"error from kyc controller which means Server error", data:error})
    }
}
export async function store(req:Request,res:Response, next:NextFunction) {
    try {
        let data:object= req.body;
        let userToken = req.headers.authorization
        let services : any = await storeTiming(data,userToken)
        if (services.status){
            res.status(200).json({success:true, message:services.message, data:services.data})
        } else {
            res.status(404).json({success:true, error:services.message,data:services.data})
        } 
    } catch (error) {
        console.log("error in controller ", error)
        res.status(500).json({success:false, error:"error from kyc controller which means Server error", data:error})
    }
}