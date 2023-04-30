import mongoose from "mongoose";


export default function connectDB(conStr , ...options){
    return mongoose.connect(conStr , ...options)
}

