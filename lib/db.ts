import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () =>{
    if(isConnected) {
        console.log("MongoDB already connected");
        return;
    }
    try {
        if(!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }
        
        const db = await mongoose.connect(process.env.MONGODB_URI as string);

        isConnected = db.connections[0].readyState === 1;

        console.log("MongoDB Connected Successfully");
    }
    catch(error){
        console.error("MongoDB connection failed:" , error);
        isConnected = false;
        throw error;
    }
};