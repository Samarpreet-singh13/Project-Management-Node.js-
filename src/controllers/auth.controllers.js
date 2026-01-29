import { User } from "../models/user.models.js";
import {ApiResponse} from "../utils/api-response.js"
import {asyncHandler} from "../utils/async-handler.js"
import {ApiError} from "../utils/api.error.js"
import { emailVerificationMailGenContent, sendEmail } from "../utils/mail.js";

// this user is same as the user created in the database model we were able to use it as it was created below  
const generateAccessAndRefreshTokens=async(userId)=>{
    try {
        const user=await User.findById(userId);
        const accessToken=user.generateAccesstoken()
        const refreshToken=user.generateRefreshtoken()

        user.refreshToken=refreshToken;

        await user.save({validateBeforeSave:false});
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refresh token");
    }
}

const registerUser=asyncHandler(async(req,res)=>{
    // all the data comes from req.body
    const {username,email,password,role}=req.body;


    const existingUser=User.findOne({
        $or:[{username,email}]
    })

    if(existingUser){
        throw new ApiError(500,"User already exists with this email or username",[]);
    }

    // create user in db user instead of User because User is the model from mongo db 
    // await because it is an async operation or a database operation
    const user= await User.create({
        email,
        password,
        username,
        isEmailVerified:false,
    });

    const {HashedToken, unHashedToken, tokenExpiry}=user.generateTemporaryToken();

    user.emailVerificationToken=HashedToken;
    user.emailVerificationExpiry=tokenExpiry;

    await user.save({validateBeforeSave:false});

    await sendEmail({
        email:user?.email,
        subject:"please verify your email",
        mailgenContent:emailVerificationMailGenContent(
            user.userName,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
        )
    });

    const createdUser=await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordExpiry");

    if(!createdUser){
        throw new ApiError(500,"something went wrong while creating user");
    }
    return res
    .status(201)
    .json(new ApiResponse(201,"User registered successfully"));
});

export {registerUser};