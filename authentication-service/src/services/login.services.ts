import { encryptHash, comparePassword } from '../utils/encryptDecrypt'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv';
import {adminLevelCheck} from '../utils/types'
dotenv.config()

export function loginService(data: any) {
    return new Promise(async (resolve, reject) => {
        try {
            if (data && data.email !== "") {
                let baseURL = process.env.DATABASE_URL;
                let newURL = baseURL + "userDatabase"
                const prisma = new PrismaClient({ datasources: { db: { url: newURL } } })
                let email:string = data.email
                let userData = await prisma.user.findMany({
                    where: {
                        email: email
                    },
                    select: {
                        id:true,
                        email: true,
                        hashedPassword: true,
                        kycStatus:true,
                        statusCode:true,
                        isAdmin:true,
                        adminLevel:true
                    }
                })
                console.log(userData)
                let passwordCompare = await comparePassword(data.hashedPassword, userData[0].hashedPassword)
                if (passwordCompare) {
                    let secretKey: string = process.env.JWT_SECRET as string
                    jwt.sign(userData[0], secretKey || "secret", function (err: any, token: any) {
                        if (err) {
                            console.log("error during token creation", err)
                            prisma.$disconnect()
                            resolve({ status: false, error: "JWT error" })
                        }
                        console.log("logged in success")
                        resolve({ status: true, data: {token:token, email:userData[0].email,statusCode:userData[0].statusCode} })
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

export function adminLevelCheck (token:string){
    return new Promise(async( resolve,reject)=>{
        try {
            let baseURL = process.env.DATABASE_URL;
            let newURL = baseURL + "userDatabase"
            if (typeof token === 'undefined'){
                console.log("no token");
                resolve({status:false, message:"no token"})
            }
            let splitToken  = token.split(" ")[1]
            let secret = process.env.JWT_SECRET as string;
            const prisma = new PrismaClient({ datasources: { db: { url: newURL } } })
            await jwt.verify(splitToken,secret, async (err:any, decoded:any)=>{
                if(err){
                    console.log("error in token", err);
                    resolve({status:false, message:"error in token"})
                }
                await prisma.user.findMany({
                    where:{
                     id: decoded.id
                    }, 
                    select:{
                      isAdmin:true
                    }
                }).then((response:adminLevelCheck)=>{
                   prisma.$disconnect();
                   if(response.length>0){
                    resolve({status:true, message:"It is Admin"})
                   } else{
                    resolve({status:false, message:"Not an Admin"})
                   }
                })
            })
            
            
        } catch (error) {
            console.log("error in service", error)
            reject({ status: false, message:"internal server error",data: error })
        }
    })
}
