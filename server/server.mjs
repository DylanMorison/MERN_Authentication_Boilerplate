import express from "express";
import morgan from "morgan";
import cors from "cors";
import config from "config";
import { authRouter } from "./routes/auth.mjs";
import { connectDB } from "./config/db.mjs";

const NODE_ENV = config.get("NODE_ENV");

connectDB();

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
if (NODE_ENV === "development") {
	app.use(cors({ origin: `http://localhost:3000` }));
}

// middleware
app.use("/auth", authRouter);

const PORT = process.env.port || 5000;

app.listen(PORT, () => {
	console.log(`Server is up on port ${PORT}! - ${NODE_ENV}`);
});
