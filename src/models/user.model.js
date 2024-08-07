import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
const userschema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String, //cloudinary url
        reqired:true
    },
    coverImage:{
        type:String, //cloudinary url
    },
    watchHistory:[
        {
        type:Schema.Types.ObjectId, //cloudinary url
        required:true
        }
    ],
    password:{
        type:String,
        required:[true,'password is required']
    },
    refreshToken:{
        type:String
    }
},
{
    timestamps:true
}
)
userschema.pre("save",async function (next){
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password,10);
    next();
})
userschema.methods.isPasswordCorrect=async function (password){
    return await bcrypt.compare(password,this.password);
}
userschema.methods.generateAccessToken=function(){
    return jwt.sign({
        _id:this.id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
    },
       process.env.ACCESS_TOKEN_SECRET,
       {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
       }
)
}
userschema.methods.generateRefreshToken=function(){
    return jwt.sign({
        _id:this.id,
    },
       process.env.REFRESH_TOKEN_SECRET,
       {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
       }
)
}

export const User=mongoose.model("User",userschema)