import {Schema,models,model} from "mongoose";

const UserSchema = new Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
        },
        email:{
            type:String,
            required:true,
            unique: true,
            lowercase: true,
            index: true,
        },
        password:{
            type: String,
            required: true,
            minlength:8,
            select:false //this field wil not be returned in queries by default
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
        profileImage:{
            type:String,
            default:""
        },
        isVerified:{
            type:Boolean,
            default: false,
        },
        lastLogin: {
            type: Date
        },

        loginAttempts: {
            type: Number,
            default: 0
        }

    },
    {
        timestamps :true
    }
);

const User = models.User || model("User", UserSchema);

export default User;