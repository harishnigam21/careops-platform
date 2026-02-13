import express from "express";
import { configDotenv } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import corsOptions from "./config/cors.js";
import credentials from "./middlewares/credentials/credentials.js";
import connectDB from "./DB/DBConnection.js";
import Auth from "./routes/Auth.js";
import WorkSpace from "./routes/WorkSpace.js";
import Service from "./routes/Service.js";
import Booking from "./routes/Booking.js";
const PORT = process.env.PORT || 5000;
const app = express();
configDotenv();
connectDB();

//App level middlewares
app.use(credentials); //checking origin
app.use(express.json()); //parsing data and make fully used data available in body
app.use(express.urlencoded({ extended: true })); //parses incoming requests with URL-encoded payloads
app.use(cookieParser()); //parse the cookies that are attached to the request
app.use(cors(corsOptions)); //enable CORS with various options

//App level Routes
// NOTE: In controller no validation of data has ben done, for validation separate middleware are created and used it before controller, in route.
app.use("/", Auth);
app.use("/", WorkSpace);
app.use("/", Service);
app.use("/", Booking);

app.get("/", (req, res) =>
  res.status(200).json({ message: "Backend Server is Running Perfect" }),
);
app.get("/health", (req, res) => res.sendStatus(200));
app.listen(PORT, () =>
  console.log(`Backend Server running on port number ${PORT}`),
);
