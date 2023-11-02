import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import jwtDecode from 'jwt-decode';
import {stringToBool} from '../utils/stringToBool'



dotenv.config()
export function kycService(data: any, file: any, userToken: any) {
    return new Promise(async (resolve, reject) => {
        try {
            if (data && userToken) {
                let baseURL = process.env.DATABASE_URL;
                let userID = await jwtDecode(userToken.split(" ")[1]) as any
                let newURL = baseURL + "kycDatabase";
                let userDataUrl = baseURL + "userDatabase";
                let userConnection = new PrismaClient({ datasources: { db: { url: userDataUrl } } })
                let userIDMatch = await userConnection.user.findMany({
                    where: {
                        id: userID.id
                    },
                    select: {
                        id: true,
                        kycStatus: true
                    }
                })
                await userConnection.$disconnect();
                if (userIDMatch.length > 0 && userIDMatch[0].kycStatus===0) {
                    //pass the image path
                    const prisma = new PrismaClient({ datasources: { db: { url: newURL } } })
                    await prisma.kyc.create({
                        data: {
                            "businessName": data.businessName,
                            "companyTitle": data.companyTitle,
                            "legalName": data.legalName,
                            "info": data.info,
                            // changes
                            "logo": file[0].path,
                            "website": data.website,
                            "address": data.address,
                            "city": data.city,
                            "country": data.country,
                            "state": data.state,
                            "pinCode": data.pinCode,
                            "geolocation": data.geolocation,
                            "contactEmail": data.contactEmail,
                            "contactPhone": Number(data.contactPhone),
                            "pan": data.pan,
                            "gstin": data.gstin,
                            "fssaiNo": data.fssaiNo,
                            // changes
                            "canceledCheque": file[1].path,
                            "addressProof": file[2].path,
                            "idProof": file[3].path,
                            "locationAvail": data.locationAvail,
                            "organization": data.organization,
                            "packageWeight": data.packageWeight,
                            "hsn": data.hsn,
                            "distrLicenseNo": data.distrLicenseNo,
                            "userId": userIDMatch[0].id
                        }
                    }).then(async (response: any) => {
                        console.log(response)
                       await userConnection.user.update({
                            where:{
                                id: userIDMatch[0].id
                            }, 
                            data:{
                                kycStatus: 1
                            }
                        }).then((response:any)=>{
                            console.log("reponse from kyc", response)
                        })
                        resolve({ status: true, message: "Kyc done", data: { id: response.id, businessName: response.businessName } })
                    }).catch((err: any) => {
                        console.log("error during create kyc", err);
                        reject({ status: false, message: "missing content or wrong content during KYC", data: err })
                    })
                } else if(userIDMatch[0].kycStatus===4) {
                    resolve({ status: false, message: "kyc done already" })
                } else {
                    resolve({ status: false, message: "no user found" })
                }
            } else {
                console.log("missing credentials in required fields or Auth Failed")
                resolve({ status: false, error: "missing credentials in required fields or Auth Failed" })
            }
        } catch (error) {
            console.log("error in service", error)
            reject({ status: false })
        }
    })
}

export function bankDetailsAdd(data: any, userToken: any) {
    return new Promise(async (resolve, reject) => {
        try {
            if (data && userToken) {
                let baseURL = process.env.DATABASE_URL;
                //kyc url
                let newURL = baseURL + "kycDatabase";
                let userDataUrl = baseURL + "userDatabase";
                let userID = await jwtDecode(userToken.split(" ")[1]) as any
                let userConnection = new PrismaClient({ datasources: { db: { url: userDataUrl } } })
                let userIDMatch = await userConnection.user.findMany({
                    where: {
                        id: userID.id
                    },
                    select: {
                        id: true,
                        kycStatus: true
                    }
                })
                await userConnection.$disconnect();
                if (userIDMatch.length > 0 && userIDMatch[0].kycStatus===1) {
                    let prisma = new PrismaClient({ datasources: { db: { url: newURL } } })
                    await prisma.bankDetails.create({
                        data: {
                            "accountHolderName": data.accountHolderName,
                            "accountNumber": Number(data.accountNumber),
                            "bankName": data.bankName,
                            "bankCity": data.bankCity,
                            "branch": data.branch,
                            "IfscCode": data.IfscCode,
                            "userId": userIDMatch[0].id
                        }
                    }).then(async(response: any) => {
                        await userConnection.user.update({
                            where:{
                                id: userIDMatch[0].id
                            }, 
                            data:{
                                kycStatus: 2
                            }
                        })
                        console.log("bank details", response)
                        prisma.$disconnect()
                        resolve({ status: true, message: "Bank details added", data: { id: response.id, accountHolderName: response.accountHolderName } })
                    }).catch((err: any) => {
                        prisma.$disconnect()
                        let errData = Object.values(err)[0];
                        console.log(err)
                        if (errData === "PrismaClientValidationError") {
                            resolve({ status: false, message: "bank details validation err" })
                        }
                        resolve({ status: false, message: "missing content or wrong content in Bank details", data: err })
                    })
                } else if(userIDMatch[0].kycStatus===4) {
                    resolve({ status: false, message: "kyc done already" })
                } else {
                    resolve({ status: false, message: "no kyc found" })
                }
            } else {
                resolve({ status: false, message: "no data in body or Auth Failed" })
            }
        } catch (error) {
            console.log("error from bank details add service", error)
            reject({ status: false, message: "error in bank details service" })
        }
    })
}

export function ondcAdd(data: any, userToken: any) {
    return new Promise(async (resolve, reject) => {
        try {
            if (data && userToken) {
                let baseURL = process.env.DATABASE_URL;
                let newURL = baseURL + "kycDatabase";
                let userDataUrl = baseURL + "userDatabase";
                let userID = await jwtDecode(userToken.split(" ")[1]) as any
                let userConnection = new PrismaClient({ datasources: { db: { url: userDataUrl } } })
                let userIDMatch = await userConnection.user.findMany({
                    where: {
                        id: userID.id
                    },
                    select: {
                        id: true,
                        kycStatus:true
                    }
                })
                await userConnection.$disconnect();
                if (userIDMatch.length > 0 && userIDMatch[0].kycStatus===2) {
                    let prisma = new PrismaClient({ datasources: { db: { url: newURL } } })
                    if(typeof data.cancellable==='string')data.cancellable = stringToBool(data.cancellable);
                   if(typeof data.returnable==='string') data.returnable = stringToBool(data.returnable);
                   if(typeof data.availableCOD==='string') data.availableCOD = stringToBool(data.availableCOD);
                   if(typeof data.sellerPickupReturn==='string') data.sellerPickupReturn = stringToBool(data.sellerPickupReturn);
                    await prisma.ondc.create({
                        data: {
                            "timeToShip": data.timeToShip,
                            "cancellable": data.cancellable,
                            "returnable": data.returnable,
                            "returnableDate":data.returnableDate ? data.returnableDate : 0,
                            "sellerPickupReturn": data.sellerPickupReturn,
                            "availableCOD": data.availableCOD,
                            "defaultCategoryId": data.defaultCategoryId,
                            "consumerCare": data.consumerCare,
                            "userId": userIDMatch[0].id
                        }
                    }).then(async (response: any) => {
                        await userConnection.user.update({
                            where:{
                                id: userIDMatch[0].id
                            }, 
                            data:{
                                kycStatus: 3
                            }
                        })
                        console.log("ONDC details", response)
                        prisma.$disconnect()
                        resolve({ status: true, message: "ONDC details added", data: { id: response.id } })
                    }).catch((err: any) => {
                        prisma.$disconnect()
                        let errData = Object.values(err)[0];
                        console.log(err)
                        if (errData === "PrismaClientValidationError") {
                            resolve({ status: false, message: "ondc validation error" })
                        }
                        resolve({ status: false, message: "ondc validation error", data: err })
                    })
                } else if(userIDMatch[0].kycStatus===4) {
                    resolve({ status: false, message: "kyc done already" })
                } else {
                    resolve({ status: false, message: "no bank details found" })
                }
            } else {
                resolve({ status: false, message: "no data in body or Auth Failed" })
            }
        } catch (error) {
            console.log("error from ondc add service", error)
            reject({ status: false, message: "error in ondc service" })
        }
    })
}

export function storeTiming(data: any, userToken: any) {
    return new Promise(async (resolve, reject) => {
        try {
            if (data && userToken) {
                let baseURL = process.env.DATABASE_URL;
                let newURL = baseURL + "kycDatabase";
                let userDataUrl = baseURL + "userDatabase";
                let userID = await jwtDecode(userToken.split(" ")[1]) as any
                let userConnection = new PrismaClient({ datasources: { db: { url: userDataUrl } } })
                let userIDMatch = await userConnection.user.findMany({
                    where: {
                        id: userID.id
                    },
                    select: {
                        id: true,
                        kycStatus:true
                    }
                })
                await userConnection.$disconnect();
                if (userIDMatch.length > 0 && userIDMatch[0].kycStatus===3) {
                    let prisma = new PrismaClient({ datasources: { db: { url: newURL } } })
                    await prisma.storeTiming.create({
                        data: {
                            "type": data.type,
                            "days": data.days,
                            "startTime": data.startTime,
                            "endTime": data.endTime,
                            "userId":userIDMatch[0].id
                        }
                    }).then(async(response: any) => {
                       await  userConnection.user.update({
                            where:{
                                id: userIDMatch[0].id
                            }, 
                            data:{
                                kycStatus: 4
                            }
                        })
                        console.log("store time details", response)
                        prisma.$disconnect()
                        resolve({ status: true, message: "Store timing details added", data: { id: response.id } })
                    }).catch((err: any) => {
                        prisma.$disconnect()
                        let errData = Object.values(err)[0];
                        console.log(err)
                        if (errData === "PrismaClientValidationError") {
                            resolve({ status: false, message: "empty required field or kyc missing" })
                        }
                        resolve({ status: false, message: "missing content or wrong content in ONDC details", data: err })
                    })
                } else if(userIDMatch[0].kycStatus===4) {
                    resolve({ status: false, message: "kyc done already" })
                } else {
                    resolve({ status: false, message: "no ondc details found" })
                }
            } else {
                resolve({ status: false, message: "no data in body or Auth Failed" })
            }

        } catch (error) {
            console.log("error from ondc add service", error)
            reject({ status: false, message: "error in ondc service" })
        }
    })
}
