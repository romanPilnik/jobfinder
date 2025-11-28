import "./App.css";
import { useEffect } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

function App() {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      fetch("http://localhost:5000/api/users/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: user.id,
          email: user.primaryEmailAddress.emailAddress,
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log("User synced:", data))
        .catch((err) => console.error("Sync error:", err));
    }
  }, [isSignedIn, user]);

  return (
    <header>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
        <p>Welcome!</p>
      </SignedIn>
    </header>
  );
}

export default App;
