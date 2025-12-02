const axios = require("axios");

const searchJobs = async (title, location, experience_level, job_type) => {
  const options = {
    method: "GET",
    url: "https://real-time-glassdoor-data.p.rapidapi.com/job-search",
    params: {
      query: title,
      location: location,
      domain: "www.glassdoor.com",
      min_company_rating: "ANY",
      easy_apply_only: false,
      remote_only: false,
      limit: 100,
    },
    headers: {
      "x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
      "x-rapidapi-host": "real-time-glassdoor-data.p.rapidapi.com",
    },
  };

  try {
    const { data } = await axios.request(options);
    return data;
  } catch (error) {
    console.error("Glassdoor API Error:", error);
    throw error;
  }
};

module.exports = { searchJobs };
