import * as dotenv from 'dotenv';
import prisma from '@prisma/client';

dotenv.config()
export function kycService(data:any) {
    return new Promise(async (resolve, reject) => {
        try {



        } catch (error) {
            console.log("error in service", error)
            reject({ status: false })
        }
    })
}