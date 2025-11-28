const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/sync", async (req, res) => {
  try {
    const { clerkId, email } = req.body;

    let user = await User.findOne({ clerkId });

    if (!user) {
      user = await User.create({ clerkId, email });
      console.log("New user created:", email);
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Error syncing user:", error);
    res.status(500).json({ error: "Failed to sync user" });
  }
});

module.exports = router;
