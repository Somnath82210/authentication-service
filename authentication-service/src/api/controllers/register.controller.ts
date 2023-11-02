import { registerService,adminCreate } from "../../services/register.services"
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
        if (services.status) {
            res.status(200).json({ success: true, message: services.message, data: services.data })
        } else {
            res.status(204).json({ success: false, error: "Missing value in Input" })
        }
    } catch (error) {
        console.log("Error in controller", error)
        res.status(500).json({ success: false, error: "catch-error in controller" })
    }

}
export async function userAdminController(req: Request, res: Response, next: NextFunction) {
    try {
        let data =req.body
        let services: any = await adminCreate(data)
        if (services.status) {
            res.status(200).json({ success: true, message: services.message, data: services.data })
        } else {
            res.status(204).json({ success: false, error: "Missing value in Input" })
        }
    } catch (error) {
        console.log("Error in controller", error)
        res.status(500).json({ success: false, error: "catch-error in controller" })
    }

}
