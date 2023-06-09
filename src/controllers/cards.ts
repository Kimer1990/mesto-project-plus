import { ObjectId } from "mongoose";
import { NextFunction, Request, Response } from "express";
import { Card } from "../models";
import { BadRequestError, NotFoundError, ForbiddenError } from "../errors";
import { ICustomRequest } from "../types";

export const getCards = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => Card.find({})
  .then((cards) => res.status(200).send(cards))
  .catch(next);

export const createCard = (
  req: ICustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const id = req.user!._id;
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: id,
  })
    .then((newCard) => res.status(201).send(newCard))
    .catch((err) => {
      if (err instanceof Error && err.name === "ValidationError") {
        next(new BadRequestError("Были предоставлены неверные данные"));
      } else {
        next(err);
      }
    });
};

export const deleteCardById = (
  req: ICustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { cardId } = req.params;
  return Card.findById(cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError("Нет карточки с таким id"));
      } else if (card.owner.toString() !== req.user!._id) {
        next(new ForbiddenError("Чужие карточки нельзя удалить"));
      } else {
        Card.findByIdAndDelete(cardId).then(() => {
          res.status(200).send({
            message: "Карточка удалена",
          });
        });
      }
    })
    .catch((err) => {
      if (err instanceof Error && err.name === "CastError") {
        next(new BadRequestError("Передан невалидный id"));
      } else {
        next(err);
      }
    });
};

export const likeCard = (
  req: ICustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const id = req.user!._id;
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError("Нет карточки с таким id"));
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => {
      if (err instanceof Error && err.name === "CastError") {
        next(new BadRequestError("Передан невалидный id"));
      } else {
        next(err);
      }
    });
};

export const dislikeCard = (
  req: ICustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const id = req.user!._id as ObjectId;
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(cardId, { $pull: { likes: id } }, { new: true })
    .then((card) => {
      if (!card) {
        next(new NotFoundError("Нет карточки с таким id"));
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => {
      if (err instanceof Error && err.name === "CastError") {
        next(new BadRequestError("Передан невалидный id"));
      } else {
        next(err);
      }
    });
};
