const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { clerkMiddleware } = require("@clerk/express");
const { requireAuth, getAuth } = require("@clerk/express");
require("dotenv").config();
const usersRouter = require("./routes/users");
const jobsRouter = require("./routes/jobs");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use("/api/users", usersRouter);
app.use("/api/jobs", jobsRouter);
app.use(clerkMiddleware({}));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error", err));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
