const express = require("express");
const router = express.Router();
const { requireAuth, getAuth } = require("@clerk/express");
const Job = require("../models/Job");
const { searchJobs } = require("../services/jobs.service");

router.get("/search", async (req, res) => {
  try {
    const { title, location, experience_level, job_type } = req.query;

    const results = await searchJobs(
      title,
      location,
      experience_level,
      job_type
    );

    res.json({ success: true, data: results.data });
  } catch (error) {
    console.error("Error searching jobs:", error);
    res.status(500).json({ error: "Failed to search jobs" });
  }
});

router.post("/save", requireAuth(), async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const {
      title,
      company,
      location,
      description,
      salary,
      postedDate,
      sourceUrl,
    } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      description,
      salary,
      postedDate,
      sourceUrl,
      userId,
    });

    res.json({ success: true, job });
  } catch (error) {
    console.error("Error saving job:", error);
    res.status(500).json({ error: "Failed to save job" });
  }
});

router.delete("/:jobId", requireAuth(), async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const { jobId } = req.params;

    const job = await Job.findOneAndDelete({ _id: jobId, userId });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json({ success: true, message: "Job removed" });
  } catch (error) {
    console.error("Error removing job:", error);
    res.status(500).json({ error: "Failed to remove job" });
  }
});

router.get("/saved", requireAuth(), async (req, res) => {
  try {
    const { userId } = getAuth(req);

    const jobs = await Job.find({ userId }).sort({ savedAt: -1 });

    res.json({ success: true, jobs });
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    res.status(500).json({ error: "Failed to fetch saved jobs" });
  }
});

module.exports = router;
