import { Router } from "express";
import {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} from "../controllers";
import { cardIdValidation, createCardValidation } from "../validation";

const cardsRouter = Router();

cardsRouter.get("/", getCards);
cardsRouter.post("/", createCardValidation, createCard);
cardsRouter.delete("/:cardId", cardIdValidation, deleteCardById);
cardsRouter.put("/:cardId/likes", cardIdValidation, likeCard);
cardsRouter.delete("/:cardId/likes", cardIdValidation, dislikeCard);

export default cardsRouter;
