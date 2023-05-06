import { celebrate, Joi } from "celebrate";
import { STRING_REG_EXP } from "../utils/reg-exp";

export const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(STRING_REG_EXP),
  }),
});

export const cardIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
});
