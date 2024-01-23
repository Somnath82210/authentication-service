"use strict";
import { encryptHash } from "../utils/encryptDecrypt";
//import  prisma  from '../dbconnection/connection''
import * as dotenv from "dotenv";
import jwtDecode from "jwt-decode";
import {
  prismaUserDataUrl,
  prismaKycUrl,
  prismaAdminDataUrl,
} from "../db/connect";
import { sendMail } from "../utils/helpers";
dotenv.config();

export function registerService(data: any) {
  return new Promise(async (resolve, reject) => {
    try {
      if (data) {
        let hashedPassword: string = await encryptHash(data.hashedPassword);
        await prismaUserDataUrl.user
          .create({
            data: {
              firstName: data.firstName,
              lastName: data.lastName,
              phoneNumber: Number(data.phoneNumber),
              email: data.email,
              hashedPassword: hashedPassword,
              parentId: ["652e0ec6b44f82ea2be52c46"],
              adminId: "652e0ec6b44f82ea2be52c46",
            },
          })
          .then(async (response: any) => {
            resolve({
              status: true,
              message: "user created",
              data: {
                id: response.id,
                email: response.email,
                Name: response.firstName + " " + response.lastName,
              },
            });
          });
      } else {
        console.log("data missing- from service");
        resolve({ status: false });
      }
    } catch (error) {
      console.log(error);
      reject({ status: false });
    }
  });
}

export function adminCreate(adminToken: string, data: any) {
  return new Promise(async (resolve, reject) => {
    try {
      if (data) {
        let token = (await jwtDecode(adminToken.split(" ")[1])) as any;
        if (token.isAdmin === false) {
          resolve({ status: false, message: "not an admin token" });
        }
        if (token.adminLevel > 1) {
          await prismaAdminDataUrl.userAdmin
            .create({
              data: {
                adminLevel: data.adminLevel,
                adminName: data.adminName,
                email: data.email,
                adminId: token.id,
              },
            })
            .then(async (response: any) => {
              // let parentId = [] as  any;
              // if(data.adminLevel===2 && token.adminLevel===3){
              //     parentId.push("652e0ec6b44f82ea2be52c46");
              // } else if(data.adminLevel===1 && token.adminLevel===3) {
              //     parentId.push("652e0ec6b44f82ea2be52c46");
              // } else {
              //     parentId.push(token.id.toString())
              //     parentId.push("652e0ec6b44f82ea2be52c46");
              // }
              await prismaUserDataUrl.user
                .updateMany({
                  where: {
                    email: data.email,
                  },
                  data: {
                    isAdmin: true,
                    adminLevel: data.adminLevel,
                  },
                })
                .then((res: any) => {
                  if (res) {
                    resolve({
                      status: true,
                      message: "user admin created",
                      data: { id: response.id },
                    });
                  } else {
                    resolve({
                      status: false,
                      message: "no user found or no email match",
                    });
                  }
                });
            });
        }
      } else {
        console.log("data missing- from service");
        resolve({ status: false });
      }
    } catch (error) {
      console.log(error);
      reject({ status: false });
    }
  });
}

export function getUserSettingsService(token: string) {
  return new Promise(async (resolve, reject) => {
    try {
      let tokenData = (await jwtDecode(token.split(" ")[1])) as any;
      let userData = await prismaUserDataUrl.user.findMany({
        where: {
          id: tokenData.id,
        },
        select: {
          isAdmin: true,
        },
      });
      if (userData.length > 0) {
        if (userData[0].isAdmin === true) {
        } else {
          await prismaUserDataUrl.user
            .findMany({
              where: {
                id: tokenData.id,
              },
              select: {
                isAdmin: true,
                adminLevel: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                email: true,
                profImage: true,
                bio: true,
              },
            })
            .then(async (response: any) => {
              resolve({
                status: true,
                message: "user settings fetched",
                data: response[0],
              });
            });
        }
      } else {
        resolve({ status: false, message: "user not found" });
      }
    } catch (error) {
      console.log(error);
      reject({ status: false });
    }
  });
}

export function updateUserService(token: string, data: any, file: any) {
  return new Promise(async (resolve, reject) => {
    try {
      let tokenData = (await jwtDecode(token.split(" ")[1])) as any;
      let userData = await prismaUserDataUrl.user.findMany({
        where: {
          id: tokenData.id,
        },
        select: {
          isAdmin: true,
        },
      });
      if (userData.length > 0) {
        //             if(userData[0].isAdmin===true){

        // //admin priviledges

        //             } else {
        if (file.length > 0) {
          await prismaUserDataUrl.user
            .updateMany({
              where: {
                id: tokenData.id,
              },
              data: {
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber,
                profImage: file[0].path,
                bio: data.bio,
              },
            })
            .then((response: any) => {
              resolve({
                status: true,
                message: "user settings updated",
                id: tokenData.id,
              });
            })
            .catch((error: any) => {
              let errData;
              Object.keys(error).forEach((values) => (errData = error[values]));
              if (errData === "PrismaClientKnownRequestError") {
                resolve({ status: false, message: "email already exists" });
              }
              resolve({
                status: false,
                message: "error in updating user settings",
              });
            });
        } else {
          await prismaUserDataUrl.user.update({
            where: {
              id: tokenData.id,
            },
            data: {
              bio: data.bio,
            },
          });
          resolve({ status: true, message: "Bio updated", id: tokenData.id });
        }
      } else {
        resolve({ status: false, message: "user not found" });
      }
    } catch (error) {
      console.log(error);
      reject({ status: false });
    }
  });
}
