import expressValidator from "express-validator";

const { check } = expressValidator;

export const userSignUpValidator = [
	check("name", "Please include a valid username").not().isEmpty(),
	check("email", "Please include a valid email").isEmail(),
	check("password", "Please include a valid password").isLength({ min: 6 })
];
