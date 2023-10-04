import * as bcrypt from "bcryptjs"
import * as dotenv from 'dotenv'
dotenv.config()
export function encryptHash (data:string){
 let salt = process.env.SALT_ROUND;
 return  bcrypt.hash(data,Number(salt)||10);
}
export function comparePassword (inputPassword:string, hashedPassword:string){
return bcrypt.compare(inputPassword, hashedPassword)
}