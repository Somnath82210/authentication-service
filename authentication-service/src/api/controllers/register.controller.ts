import { registerService,adminCreate, getUserSettingsService, updateUserService } from "../../services/register.services"
import { Request, Response, NextFunction } from "express"
import asyncError from "../../utils/asyncError"

export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        let data = {
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "phoneNumber": req.body.phoneNumber,
            "email": req.body.email,
            "hashedPassword": req.body.password,
            token: req.headers.authorization
        }
        let services: any = await registerService(data)
        if (services.status===true) {
            res.status(200).json({ success: true, message: services.message, data: services.data })
        } else if(services.status===false) {
            res.status(400).json({ success: false, error: services.message })
        }
    } catch (error) {
        console.log("Error in controller", error)
        res.status(500).json({ success: false, error: "catch-error in controller" })
    }

}
export async function userAdminController(req: Request, res: Response, next: NextFunction) {
    try {
        let data =req.body
        let token = req.headers.authorization as any;
        let services: any = await adminCreate(token,data)
        if (services.status === true) {
            res.status(200).json({ success: true, message: services.message, data: services.data })
        } else if (services.status === false) {
            res.status(400).json({ success: false, error: "Missing value in Input" })
        }
    } catch (error) {
        console.log("Error in controller", error)
        res.status(500).json({ success: false, error: "catch-error in controller" })
    }

}

export async function getUserSettingsController(req: Request, res: Response, next: NextFunction) {
    try {
        let token = req.headers.authorization as any;
        let services: any = await getUserSettingsService(token)
        if (services.status === true) {
            res.status(200).json({ success: true, message: services.message, data: services.data })
        } else if (services.status === false) {
            res.status(400).json({ success: false, error: "Missing value in Input" })
        }
    } catch (error) {
        console.log("Error in controller", error)
        res.status(500).json({ success: false, error: "catch-error in controller" })
    }

}
export async function updateUserController(req:Request,res:Response,next:NextFunction) {
    try {
        let token = req.headers.authorization as any;
        let file = req.files as any;
        let data:object = req.body;
        let services: any = await updateUserService(token, data,file)
        if (services.status===true) {
            res.status(200).json({ success: true, message: services.message, id: services.id })
        } else if(services.status===false) {
            res.status(400).json({ success: false, error: services.message })
        }
    } catch (error) {
        console.log("Error in controller", error);
        res.status(500).json({ success: false, error: "catch-error in controller" })
    }
}