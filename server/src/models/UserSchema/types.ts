import {Document} from "mongoose"

export interface User extends Document { 
    username:string,
    hashed_password:string,
    salt:string,
    updated:string,
    authenticate: (arg:string) => boolean,
    makeSalt:() => string,
    encryptPassword:(arg:string) => string,
    _password:string
}