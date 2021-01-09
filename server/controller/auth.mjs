import User from "../models/user.mjs";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";
import config from "config";

const SENDGRID_API_KEY = config.get("SENDGRID_API_KEY");
const JWT_ACCOUNT_ACTIVATION = config.get("JWT_ACCOUNT_ACTIVATION");
const EMAIL_FROM = config.get("EMAIL_FROM");
const CLIENT_URL = config.get("CLIENT_URL");

sgMail.setApiKey(SENDGRID_API_KEY);

// export const signup = async (req, res) => {
// 	const { name, email, password } = req.body;

// 	try {
// 		await User.findOne({ email }, (err, user) => {
// 			if (user) {
// 				return res.status(400).json({ error: "email is in use" });
// 			} else {
// 				let newUser = new User({ name, email, password });
// 				newUser.save((err, success) => {
// 					if (err) {
// 						console.log("SIGNUP ERROR WITHIN newUser.save() callback", err);
// 						return res.status(400).json({
// 							error: err
// 						});
// 					}
// 					res.json({
// 						message: "Signup success! Please Login"
// 					});
// 				});
// 			}
// 		});
// 	} catch (error) {
// 		res.status(400).json({ error: "signup controller error" });
// 	}
// };
export const signup = async (req, res) => {
	const { name, email, password } = req.body;

	try {
		await User.findOne({ email }, (err, user) => {
			if (user) {
				return res.status(400).json({ error: "email is in use" });
			} else {
				const token = jwt.sign(
					{ name, email, password },
					JWT_ACCOUNT_ACTIVATION,
					{ expiresIn: "10min" }
				);

				const emailTemplate = {
					from: EMAIL_FROM,
					to: email,
					subject: `Account Activation Link`,
					html: `
						<h1>Please use the following link to activate your account</h1>
						<p>${CLIENT_URL}/auth/activate</p>
						<hr />
						<p>This email may contain sensitive information</p>
						<p>${CLIENT_URL}</p>
					`
				};

				sgMail.send(emailTemplate);
			}
		});
	} catch (error) {
		res.status(400).json({ error: "signup controller error" });
	}
};
/**
 * Lets use the concept of email confirmation.
 * when a user wants to sign up we will send them an email.
 * If the email they provided is valid the user will be able to
 * see the confirmation email. The email will have a URL that is
 * encoded in a JWT.  Upon clicking on the URL they will be taken to the client/react
 * app where we will grab the encoded JWT.
 */
