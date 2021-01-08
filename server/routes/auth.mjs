import express from "express";
// controllers
import { signup } from "../controller/auth.mjs";
// validators
import { userSignUpValidator } from "../validators/auth.mjs";
import { runValidation } from "../validators/index.mjs";

const router = express.Router();

router.post("/signup", userSignUpValidator, runValidation, signup);

export { router as authRouter };
