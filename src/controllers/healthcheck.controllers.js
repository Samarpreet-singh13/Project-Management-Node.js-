import {ApiResponse} from '../utils/api-response.js';
import {asyncHandler} from '../utils/async-Handler.js';
// const healthcheck=(req,res)=>{
//     try {
//         res
//             .status(200)
//             .json(new ApiResponse(200,{message:"server is running"}));
//     } catch (error) {
//         console.error("Errror");
        
//     }
// }

const healthcheck=asyncHandler(async(req,res)=>{
    res.status(200).json(new ApiResponse(200,{message:"Server is running"}));
})

export {healthcheck};