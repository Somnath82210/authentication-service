import { encryptHash, comparePassword } from '../utils/encryptDecrypt'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv';
dotenv.config()
export function loginService(data: any) {
    return new Promise(async (resolve, reject) => {
        try {
            if (data && data.email !== "") {
                let baseURL = process.env.DATABASE_URL;
                let newURL = baseURL + "userDatabase"
                const prisma = new PrismaClient({ datasources: { db: { url: newURL } } })
                let email = data.email
                let userData = await prisma.user.findMany({
                    where: {
                        email: email
                    },
                    select: {
                        email: true,
                        hashedPassword: true
                    }
                })
                let passwordCompare = await comparePassword(data.hashedPassword, userData[0].hashedPassword)
                if (passwordCompare) {
                    let secretKey: string = process.env.JWT_SECRET as string
                    jwt.sign(userData[0].email, secretKey || "secret", function (err: any, token: any) {
                        if (err) {
                            console.log("error during token creation", err)
                            prisma.$disconnect()
                            resolve({ status: false, error: "JWT error" })
                        }
                        console.log("logged in success")
                        resolve({ status: true, data: token })
                    })
                } else {
                    console.log("login failed")
                    resolve({ status: false, error: "password failed" })
                }
            } else {
                console.log("login failed")
                resolve({ status: false, error: "password or email is missing" })
            }
        } catch (error) {
            console.log("error in service", error)
            reject({ status: false, data: error })

        }
    })
}