import { model, Schema } from "mongoose";
import { IUser } from "../types";

const userModel = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    about: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 200,
    },
    avatar: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

export default model<IUser>("user", userModel);
