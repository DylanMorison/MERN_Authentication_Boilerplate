import mongoose from "mongoose";
import config from "config";
const db = config.get("mongoURI");

export const connectDB = async () => {
	try {
		await mongoose.connect(db, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true
		});
		console.log("MongoDB Connection Established!");
	} catch (error) {
		console.error(error.message);
		process.exit(1);
	}
};
