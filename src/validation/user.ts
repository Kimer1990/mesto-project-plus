import { celebrate, Joi } from "celebrate";
import { STRING_REG_EXP } from "../utils/reg-exp";

export const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(STRING_REG_EXP),
    about: Joi.string().min(2).max(200),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

export const getUserByIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
});

export const updateProfileValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
  }),
});
export const updateProfileAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(STRING_REG_EXP),
  }),
});

export const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});
