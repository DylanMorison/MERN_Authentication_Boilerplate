import User from "../models/user.mjs";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";
import config from "config";

import { emailConfirmation } from "../services/email_templates/emailConfirmation.js";

const SENDGRID_API_KEY = config.get("SENDGRID_API_KEY");
const JWT_ACCOUNT_ACTIVATION = config.get("JWT_ACCOUNT_ACTIVATION");
const CLIENT_URL = config.get("CLIENT_URL");
const verifiedSender = config.get("verifiedSender");

sgMail.setApiKey(SENDGRID_API_KEY);

export const signup = async (req, res) => {
	const { name, email, password } = req.body;

	try {
		await User.findOne({ email }, async (err, user) => {
			if (user) {
				return res.status(400).json({ error: "email is in use" });
			} else {
				const jwt_token = jwt.sign(
					{ name, email },
					JWT_ACCOUNT_ACTIVATION,
					{ expiresIn: "10min" }
				);
				const emailTemplate = emailConfirmation(
					verifiedSender,
					email,
					name,
					jwt_token,
					CLIENT_URL
				);

				await sgMail.send(emailTemplate, (err, result) => {
					if (err) {
						return res.status(400).json({ error: "Verification Error" });
					}
					return res.json({
						message: `Verification eail has been sent to ${email}. Visit ${CLIENT_URL}/${jwt_token} to activate your account!`
					});
				});
			}
		});
	} catch (error) {
		res.status(400).json({ error: "signup controller error" });
	}
};

export const accountActivation = async (req, res) => {
	const { token } = req.body;

	try {
		if (token) {
			jwt.verify(token, JWT_ACCOUNT_ACTIVATION, async (err, decoded) => {
				if (err) {
					console.log("JWT VERIFY IN ACCOUNT ACTIVATION ERROR", err);
					return res.status(401).json({ error: "Expired Link" });
				}

				const { name, email, password } = jwt.decode(token);

				const user = new User({ name, email, password });

				await user.save((err, user) => {
					if (err){
						console.log('Save User Error in Account Activation controller');
						return res.status(401).json({ error: "Verification Error" });
					}

					return res.json({
						message: "Signup success! Please sign in."
					})

				});
			});
		}
	} catch (error) {
		return res.status(400).json({ error: "Verification Error" });
	}
};
