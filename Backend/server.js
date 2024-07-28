import express from "express";
import mongoose from "mongoose";
import cors from "cors";
const app = express();

const PORT = 3000;
const MONGODB_URI= "mongodb://localhost:27017/";

app.use(express.json());
app.use(cors());


mongoose.connect(MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const stockSchema = new mongoose.Schema({
	company: String,
	description: String,
	initial_price: Number,
	price_2002: Number,
	price_2007: Number,
	symbol: String,
});

const Stock = mongoose.model("Stock", stockSchema);

app.get("/api/stocks", async (req, res) => {
	try {
		const stocks = await Stock.find();
		res.json(stocks);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

app.post("/api/watchlist", async (req, res) => {
	try {
		const {
			company,
			description,
			initial_price,
			price_2002,
			price_2007,
			symbol,
		} = req.body;
		const watchlist = new Stock({
			company,
			description,
			initial_price,
			price_2002,
			price_2007,
			symbol,
		});
		await watchlist.save();
		res.json({ message: `${company} Stocks added to watchlist successfully` });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
