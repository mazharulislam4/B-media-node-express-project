import { Schema, model } from "mongoose";

const conversationSchema =new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },

    participant: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    last_updated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Conversation = new model("Conversation", conversationSchema);

export default Conversation;