import "dotenv/config";
import cookieParser from "cookie-parser";
import express from "express";;
import cors from "cors";
import router from "./routes/index.js";
import { handleError } from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());
router.use(cookieParser());
app.use(cors());

app.use("/api/v1", router);

router.use(handleError);

app.listen("8000");

