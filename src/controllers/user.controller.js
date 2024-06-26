import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import {ApiResponse} from "../utils/ApiResponse.js"
const registerUser=asyncHandler( async (req,res)=>{
    
    const { fullName,email,username,register }= req.body;
    console.log("email: ",email);
    if(
        [fullName,email,username,password].some((field)=>
        field?.trim()==="")
    ){
        throw new ApiError(400,"All fields are required");
    }
    const existedUser=User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409,"user with username and email already exist");
    }
    const avatarLocalPath=req.files?.avatar[0].path;
    const coverImageLocalPath=req.files?.coverImage[0].path;
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required");
    }
    const avatar= await uploadOnCloudinary(avatarLocalPath);
    const coverImage=await uploadOnCloudinary(coverImageLocalPath);
    if(!avatar){
        throw new ApiError(400,"Avatar file is required");
    }
   const user=await  user.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
        password,
        username:username.toLowerCase()
    })
    const createdUser=await user.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )
})

export {registerUser}
