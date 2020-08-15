import {Request,Response,NextFunction} from "express"
import config from "./config"
import jwt from "jsonwebtoken"

// import dotenv from "dotenv"

// const requireSignIn = expressJwt({
//     secret:process.env.jwtSecret!,
//     userProperty:'body.auth',
//     algorithms:['HS256']
// })
const addAuth = async function(req:Request,res:Response,next:NextFunction){
    try{
        const token = req.headers.authorization?.split(" ")[1]
        if(token){
            jwt.verify(token,config.jwtSecret,function(err,decoded){
                console.log("verification success",token)
                if(err){
                    console.log("There is an err",err)
                    return next(err)
                }
                if(decoded){
                    req.body.auth = decoded
                }
            })
        }
        next()
    }catch(err){
        console.log("something went wrong",err)
        res.status(401).json({
            message: 'Some error occurred.'
        });
    }
}

export default {addAuth}