import "./App.css";
import { SignedIn, SignedOut, ClerkLoading, ClerkLoaded } from "clerk-solidjs";
import { Router, Route } from "@solidjs/router";
import Home from "./pages/Home";
import Test from "./pages/Test";
import Main from "./components/publicRoute/Main";

function App() {
  return (
    <div>
      <ClerkLoading>
        <p>Loading...</p>
      </ClerkLoading>
      <ClerkLoaded>
        <SignedIn>
          <Router>
            <Route path="/" component={Home} />
            <Route path="/test" component={Test} />
          </Router>
        </SignedIn>
        <SignedOut>
          <Main></Main>
        </SignedOut>
      </ClerkLoaded>
    </div>
  );
}

export default App;
