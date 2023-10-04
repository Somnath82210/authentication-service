import { registerService } from "../../services/register.services"
import { Request, Response, NextFunction } from "express"
import asyncError from "../../utils/asyncError"

export default async function register(req: Request, res: Response, next: NextFunction) {
    try {
        let data = {
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "phoneNumber": req.body.phoneNumber,
            "email": req.body.email,
            "hashedPassword": req.body.password,
        }
        let services: any = await registerService(data)
        if (services.status) {
            res.status(200).json({ success: true, message: "Registration done", data: services.data })
        } else {
            res.status(204).json({ success: false, error: "Missing value in Input" })
        }
    } catch (error) {
        console.log("Error in controller", error)
        res.status(500).json({ success: false, error: "catch-error in controller" })
    }

}
