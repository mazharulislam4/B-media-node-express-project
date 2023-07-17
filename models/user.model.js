import { model, Schema } from "mongoose";

// info schema

const InfoSchema = new Schema({
  education: {
    school: {
      type: String,
      trim: true,
      maxlength: [150, "maximum 150 characters allowed!"],
    },
    college: {
      type: String,
      trim: true,
      maxlength: [150, "maximum 150 characters allowed!"],
    },
    university: {
      type: String,
      trim: true,
      maxlength: [150, "maximum 150 characters allowed!"],
    },
  },
  address: {
    type: String,
    trim: true,
    maxlength: [150, "maximum 150 characters allowed!"],
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [250, "maximum 250 characters allowed!"],
  },
  relation: {
    type: String,
    trim: true,
    enum: ["single", "married", "in a relationship", "devorced"],
  },
  followers: {
    type: [String],
    default: [],
  },
  followings: {
    type: [String],
    default: [],
  }
});

const UserScheme = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxlength: 15,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      maxlength: 15,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: (prop) => `Invalid Email: ${prop.value}`,
      },
      // index: true
    },
    password: {
      type: String,
      minlength: [6, "Password is too short"],
      required: true,
    },
    posts:[{
      type: Schema.Types.ObjectId,
      ref: "Post"
   }],
    avatar: {
      url: {
        type: String,
        default: null,
      },
      id: {
        type: String,
      },
    },

    roles: {
      type: String,
      trim: true,
	    enum: ['admin' , 'user'],
      default: "user",
    },
    active_status: {
      type: String,
      trim: true,
      enum: ['online' , 'offline'],
      default: 'offline'  
  },
    info: InfoSchema,
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    virtuals: {
      fullName: {
        get() {
          return this.firstName + " " + this.lastName;
        },
      },
    },
  }
);

const User = new model("user", UserScheme);

export default User;
