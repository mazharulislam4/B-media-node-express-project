import { model, Schema } from "mongoose";


const tokenSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    fullName: {
     type: String,
     required: true
    },
    token:{
        type: String,
        required: true
    }, 
    createdAt : {
        type: Date,
        default: Date.now(),
        expires: 120,
    }
} , {timestamps: true});


const UserTokenModel =new  model('UserToken' , tokenSchema);

export default UserTokenModel;