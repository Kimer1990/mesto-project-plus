import { model, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import { IUser, IUserModal } from "../types";
import { UnauthorizedError } from "../errors";

const userModel = new Schema<IUser, IUserModal>(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: "Жак-Ив Кусто",
      validate: {
        validator: (v: string) => v.length > 2 && v.length < 200,
        message: "Имя не должено быть короче 2 символов и длиннее 30.",
      },
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 200,
      default: "Исследователь",
      validate: {
        validator: (v: string) => v.length > 2 && v.length < 200,
        message: "Описание не должено быть короче 2 символов и длиннее 200.",
      },
    },
    avatar: {
      type: String,
      default:
        "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
      validate: {
        validator: (v: string) => validator.isURL(v),
        message: "Некорректная ссылка.",
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: "Некорректный email.",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

userModel.static(
  "findUserByCredentials",
  function findUserByCredentials(email: string, password: string) {
    return this.findOne({ email })
      .select("+password")
      .then((user) => {
        if (!user) {
          return Promise.reject(
            new UnauthorizedError("Неправильные почта или пароль"),
          );
        }

        return bcrypt.compare(password, user.password).then((matched) => {
          if (!matched) {
            return Promise.reject(
              new UnauthorizedError("Неправильные почта или пароль"),
            );
          }

          return user;
        });
      });
  },
);

export default model<IUser, IUserModal>("user", userModel);
