import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv';
dotenv.config()

let baseUrl = process.env.DATABASE_URL;
let kycUrl = baseUrl + "kycDatabase";
let userDataUrl = baseUrl + 'userDatabase';
let adminDataUrl = baseUrl + 'adminDatabase';
declare global {
    var prismaKycUrl: PrismaClient | undefined
    var prismaUserDataUrl: PrismaClient | undefined
    var prismaAdminDataUrl: PrismaClient | undefined
}

const prismaKycUrl = globalThis.prismaKycUrl || new PrismaClient({ datasources: { db: { url: kycUrl } } });
const prismaUserDataUrl = globalThis.prismaUserDataUrl || new PrismaClient({ datasources: { db: { url: userDataUrl } } });
const prismaAdminDataUrl = globalThis.prismaAdminDataUrl || new PrismaClient({ datasources: { db: { url: adminDataUrl } } });
if(process.env.NODE_ENV != 'production') {
    globalThis.prismaKycUrl = prismaKycUrl
    globalThis.prismaUserDataUrl = prismaUserDataUrl
    globalThis.prismaAdminDataUrl = prismaAdminDataUrl
}

export { prismaKycUrl, prismaUserDataUrl,prismaAdminDataUrl}
