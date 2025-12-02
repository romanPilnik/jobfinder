import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import "./SearchPage.css";

function SearchPage() {
  const { user, isSignedIn } = useUser();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isSignedIn && user) {
      axios({
        method: "post",
        url: "http://localhost:5000/api/users/sync",
        data: {
          clerkId: user.id,
          email: user.primaryEmailAddress.emailAddress,
        },
      })
        .then((response) => console.log("User synced:", response.data))
        .catch((err) => console.error("Sync error:", err));
    }
  }, [isSignedIn, user]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios({
        method: "get",
        url: "http://localhost:5000/api/jobs/search",
        params: { title, location },
      });

      if (response.data.success) {
        setJobs(response.data.data.jobs || []);
      } else {
        setError("Failed to search jobs");
      }
    } catch (err) {
      setError("Error searching jobs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async (job) => {
    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:5000/api/jobs/save",
        data: {
          title: job.job_title,
          company: job.company_name,
          location: job.location_name,
          description: job.job_title + " at " + job.company_name,
          salary: "Not specified",
          postedDate: new Date(),
          sourceUrl: job.job_link,
        },
      });

      if (response.data.success) {
        alert("Job saved!");
      }
    } catch (err) {
      console.error("Error saving job:", err);
      alert("Failed to save job");
    }
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <h1 className="page-title">Job Search</h1>

        <form onSubmit={handleSearch} className="search-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Job title (e.g., React Developer)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="search-input"
            />
            <input
              type="text"
              placeholder="Location (e.g., Tel Aviv)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="search-input"
            />
            <button type="submit" disabled={loading} className="search-button">
              {loading ? "Searching..." : "Search Jobs"}
            </button>
          </div>
        </form>

        {error && <div className="error-message">{error}</div>}

        {jobs.length > 0 && (
          <div className="results-header">
            <h2>Found {jobs.length} jobs</h2>
          </div>
        )}

        <div className="jobs-grid">
          {jobs.map((job, index) => (
            <div key={index} className="job-card">
              <div className="job-header">
                {job.company_logo && (
                  <img
                    src={job.company_logo}
                    alt={job.company_name}
                    className="company-logo"
                  />
                )}
                <div className="job-title-section">
                  <h3 className="job-title">{job.job_title}</h3>
                  <p className="company-name">{job.company_name}</p>
                </div>
              </div>

              <div className="job-details">
                <p className="job-location">📍 {job.location_name}</p>
                {job.rating > 0 && (
                  <p className="company-rating">⭐ {job.rating}</p>
                )}
                {job.age_in_days && (
                  <p className="job-age">
                    🕒 Posted {job.age_in_days} days ago
                  </p>
                )}
              </div>

              <div className="job-actions">
                <a
                  href={job.job_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apply-button"
                >
                  Apply on Glassdoor
                </a>
                <button
                  onClick={() => handleSaveJob(job)}
                  className="save-button"
                >
                  💾 Save
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
