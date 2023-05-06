import { config } from "dotenv";
import { join } from "path";
import express from "express";
import mongoose from "mongoose";
import * as process from "process";
import { errors } from "celebrate";
import { auth, catchErrors } from "./middleware";
import routes from "./routes";
import { createUser, login } from "./controllers";
import { errorLogger, requestLogger } from "./middleware/logger";
import { createUserValidation, loginValidation } from "./validation";
import { NotFoundError } from "./errors";

config({ path: join(__dirname, "..", ".env") });

const { PORT = 3001, DB_URL = "none" } = process.env;

const app = express();
app.use(express.json());

app.use(requestLogger);
app.post("/signin", loginValidation, login);
app.post("/signup", createUserValidation, createUser);

app.use(auth);
app.use(routes);
app.use((req, res, next) => {
  next(new NotFoundError("такого маршрута не существует"));
});

app.use(errorLogger);
app.use(errors());
app.use(catchErrors);

async function connection() {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(DB_URL);
    await app.listen(PORT);
  } catch (err) {
    throw new Error(`Something wrong:${err}`);
  }
}

connection();
