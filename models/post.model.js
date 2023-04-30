import { Schema, model } from "mongoose";

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: [15, "Minimum 15 characters needed!"],
      maxlength: [200, "Maximum 200 characters allowed!"],
      default: "untiled",
    },
    description: {
      type: String,
      minlength: [50, "Minimum 15 characters needed!"],
      maxlength: [6000, "Maximum 6000 characters allowed!"],
    },
    image: {
      type: String,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    likes: {
      type: [Object],
      default: [],
    },
    comments: {
      type: [Object],
      default: [],
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

postSchema.pre("save", function (next) {
  this.tags = this.tags?.map((tag) => tag.trim());
  next();
});

postSchema.pre("updateOne", function (next) {
  const update = this.getUpdate();

  if (update && update.tags) {
    update.tags = update.tags.map((tag) => tag.trim());
}
next();
});

const Post = new model("Post", postSchema);

export default Post;
