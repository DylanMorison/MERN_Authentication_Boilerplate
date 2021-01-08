import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth.mjs";

dotenv.config();

const app = express();

/**
 * @morgan provides helpful data with http requests
 * @cors has to do with same-origin policy, fixes cors errors
 *       by making syre that the API is sending proper headers (Access-Control-Allow-*).
 *       By using cors we are allowing all origins to connect with
 * 		 our back end server.
 */
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if ((process.env.NODE_ENV = "development")) {
	app.use(cors({ origin: `http://localhost:3000` }));
}

// middleware
app.use("/auth", authRouter);

const PORT = process.env.port || 5000;

app.listen(PORT, () => {
	console.log(`Server is up on port ${PORT}! - ${process.env.NODE_ENV}`);
});
