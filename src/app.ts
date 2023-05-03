import { config } from "dotenv";
import { join } from "path";
import express from "express";
import mongoose from "mongoose";
import * as process from "process";
import { addTestOwner, catchErrors } from "./middleware";
import routes from "./routes";

config({ path: join(__dirname, "..", ".env") });

const { PORT = 3001, DB_URL = "none" } = process.env;

const app = express();
app.use(express.json());
app.use(addTestOwner);
app.use(routes);
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
