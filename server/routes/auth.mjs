import express from "express";
import { signup } from "../controller/auth.mjs";

const router = express.Router();

router.get("/signup", signup);

export { router as authRouter };
