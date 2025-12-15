import mongoose from "mongoose"
import {Schema,models,model} from "mongoose";

const OtpSchema = new Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
            index:true //shortcut for searching data

        },

        otp:{
            type:String,
            required: true,
        },

        expiresAt :{
            type:Date,
            required: true,
        }
    },
    {
        timestamps:true,
    }
);

OtpSchema.index({expiresAt : 1},{expireAfterSeconds:0}); //deletes after the expire time ,expireAfterSeconds-no delay after expire time

const Otp = models.Otp || model("Otp",OtpSchema); //prevents model overwrite error in Next.js

export default Otp;