'use strict'
import { encryptHash } from '../utils/encryptDecrypt'
import { PrismaClient } from '@prisma/client'
//import  prisma  from '../dbconnection/connection''
import * as dotenv from 'dotenv';
dotenv.config()

export function registerService(data: any) {
    return new Promise(async (resolve, reject) => {
        try {
            if (data) {
                let baseURL = process.env.DATABASE_URL;
                let newURL = baseURL + "userDatabase"
                const prisma = new PrismaClient({ datasources: { db: { url: newURL } } })
                let hashedPassword: string = await encryptHash(data.hashedPassword)
                await prisma.user.create({
                    data: {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        phoneNumber: Number(data.phoneNumber),
                        email: data.email,
                        hashedPassword: hashedPassword
                    }
                }).then((response: any) => {
                    console.log(response)
                    prisma.$disconnect()
                    resolve({ status: true, data: { id: response.id, email: response.email, Name: response.firstName + ' ' + response.lastName } })
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





