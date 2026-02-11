import express from "express";
const app = express();
const PORT = 5000;
app.get("/", (req, res) =>
  res.status(200).json({ message: "Backend Server is Running Perfect" }),
);
app.get("/health", (req, res) => res.sendStatus(200));
app.listen(PORT, () =>
  console.log(`Backend Server running on port number ${PORT}`),
);
