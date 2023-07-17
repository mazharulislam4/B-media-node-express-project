import { Schema, model } from "mongoose";

const messageSchema = new Schema(
    {
      text: {
        type: String,
      },
      attachment: [
        {
          type: String,
        },
      ],
      sender: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      receiver: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      date_time: {
        type: Date,
        default: Date.now,
      },
      conversation_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "conversation"
      },
    },
    {
      timestamps: true,
    }
  );
  
  const Message = new model("message", messageSchema);

  export default Message;