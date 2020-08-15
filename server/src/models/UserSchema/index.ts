import mongoose, {Schema} from "mongoose"
import {User} from "./types"
import crypto from "crypto"


const UserSchema:Schema = new Schema({
    username:{
        type:String,
        unique:true,
        trim:true,
        required:"A username is required"
    },
    hashed_password:{
        type:String,
        trim:true,
        required:"Password is required"
    },
    salt:String,
    updated:Date,
},{
    timestamps:true
})


UserSchema.virtual('password').set(function(this:User,password:string){
    this._password = password;
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
}).get(function(this:User){
    return this._password
})

UserSchema.path('hashed_password').validate(function(this:User){
    if(this._password && this._password.length < 6){
        this.invalidate("password","Password must be at least 6 character")
        if(this.isNew && !this._password){
            this.invalidate('password',"Password is required")
        }
    }
},"")

UserSchema.methods = {
    authenticate:function(plainText:string){
        return this.encryptPassword(plainText) === this.hashed_password
    },
    encryptPassword: function(password:string){
        if (!password) return ""
        try{
            return crypto.createHmac('sha1',this.salt)
            .update(password).digest('hex')
        }catch(e){
            return ""
        }
    },
    makeSalt:function(){
        return Math.round((new Date().valueOf() * Math.random())) + ''
    }
}

export default mongoose.model<User>("User",UserSchema,"users")