import { celebrate, Joi } from "celebrate";
import { stringRegExp } from "../utils/reg-exp";

export const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(stringRegExp),
  }),
});

export const cardIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
});
