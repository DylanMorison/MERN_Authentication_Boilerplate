import express from "express";
import { authRouter } from "./routes/auth.mjs";

const app = express();

// middleware
app.use("/auth", authRouter);

const PORT = process.env.port || 5000;

app.listen(PORT, () => {
	console.log(`Server is up on port ${PORT}!`);
});
