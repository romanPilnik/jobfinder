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
app.use(clerkMiddleware({}));
app.use("/api/users", usersRouter);
app.use("/api/jobs", jobsRouter);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error", err));

app.get("/public", (req, res) => {
  res.json({ message: "Server is running - public route" });
});

app.get("/protected", requireAuth(), (req, res) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  res.json({
    message: "You are authenticated!",
    userId: userId,
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
