const axios = require("axios");

const searchJobs = async (title, location, experience_level, job_type) => {
  const options = {
    method: "GET",
    url: "https://jsearch.p.rapidapi.com/search",
    params: {
      query: `${title} jobs in ${location}`,
      page: "1",
      num_pages: "1",
      country: "il",
      date_posted: "month",
      job_requirements: experience_level || "",
      employment_types: job_type || "",
    },
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      "x-rapidapi-host": "jsearch.p.rapidapi.com",
    },
  };

  try {
    const { data } = await axios.request(options);
    return data;
  } catch (error) {
    console.error("JSearch API Error:", error);
    throw error;
  }
};

module.exports = { searchJobs };
