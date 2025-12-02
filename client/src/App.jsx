import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import SearchPage from "./pages/SearchPage";
import SavedJobsPage from "./pages/SavedJobsPage";

function App() {
  return (
    <BrowserRouter>
      <div>
        {/* Header with auth and navigation */}
        <header style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
          <nav
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Link to="/" style={{ marginRight: "1rem" }}>
                Search Jobs
              </Link>
              <Link to="/saved">Saved Jobs</Link>
            </div>
            <div>
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </nav>
        </header>

        {/* Routes - different pages */}
        <main style={{ padding: "2rem" }}>
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/saved" element={<SavedJobsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
