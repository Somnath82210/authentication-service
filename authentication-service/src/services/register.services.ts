'use strict'
import { encryptHash } from '../utils/encryptDecrypt'
import { PrismaClient } from '@prisma/client'
//import  prisma  from '../dbconnection/connection''
import * as dotenv from 'dotenv';
import jwtDecode from 'jwt-decode';
dotenv.config()

export function registerService(data: any) {
    return new Promise(async (resolve, reject) => {
        try {
            if (data) {
                let baseURL = process.env.DATABASE_URL;
                let newURL = baseURL + "userDatabase"
                const prisma = new PrismaClient({ datasources: { db: { url: newURL } } })
                let hashedPassword: string = await encryptHash(data.hashedPassword)
                if(data.token){
                    let token = await jwtDecode(data.token.split(" ")[1]) as any
                    await prisma.user.create({
                        data: {
                            firstName: data.firstName,
                            lastName: data.lastName,
                            phoneNumber: Number(data.phoneNumber),
                            email: data.email,
                            hashedPassword: hashedPassword,
                            adminId:token.id
                        }
                    }).then((response: any) => {
                        console.log(response)
                        prisma.$disconnect()
                        resolve({ status: true, message:"user created",data: { id: response.id, email: response.email, Name: response.firstName + ' ' + response.lastName } })
                    })
                } else {
                    await prisma.user.create({
                        data: {
                            firstName: data.firstName,
                            lastName: data.lastName,
                            phoneNumber: Number(data.phoneNumber),
                            email: data.email,
                            hashedPassword: hashedPassword,
                            adminId:"652e0ec6b44f82ea2be52c46"
                        }
                    }).then((response: any) => {
                        console.log(response)
                        prisma.$disconnect()
                        resolve({ status: true, message:"user created",data: { id: response.id, email: response.email, Name: response.firstName + ' ' + response.lastName } })
                    })
                }
            } else {
                console.log("data missing- from service")
                resolve({ status: false })
            }
        } catch (error) {
            console.log(error)
            reject({ status: false })
        }
    })
}

export function adminCreate(data: any) {
    return new Promise(async (resolve, reject) => {
        try {
            if (data) {
                let baseURL = process.env.DATABASE_URL;
                let newURL = baseURL + "adminDatabase"
                let userDataBase =  baseURL + 'userDatabase'
                const prisma = new PrismaClient({ datasources: { db: { url: newURL } } })
                await prisma.userAdmin.create({
                    data: data
                }).then(async (response: any) => {
                    console.log(response)
                   await prisma.$disconnect()
                    const userPrisma = new PrismaClient({ datasources: { db: { url: userDataBase } } })
                    await userPrisma.user.update({
                    where:{
                        id:data.userId
                    },
                    data:{
                        isAdmin:true,
                        adminLevel:data.adminLevel
                    }
                    })
                   await userPrisma.$disconnect()
                    resolve({ status: true, message:"user admin created",data: { id: response.id } })
                    
                })
            } else {
                console.log("data missing- from service")
                resolve({ status: false })
            }
        } catch (error) {
            console.log(error)
            reject({ status: false })
        }
    })
}





