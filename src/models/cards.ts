import { model, Schema } from "mongoose";
import validator from "validator";
import { ICard } from "../types";

const cardModel = new Schema<ICard>(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
      validate: {
        validator: (v: string) => v.length > 2 && v.length < 30,
        message: "Название не должено быть короче 2 символов и длиннее 30.",
      },
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => validator.isURL(v),
        message: "Некорректная ссылка.",
      },
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        default: [],
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

export default model<ICard>("card", cardModel);
