import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { handleError } from "./middleware/error.middleware.js";
import router from "./routes/index.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", router);

app.use(handleError);

app.listen("8000");
