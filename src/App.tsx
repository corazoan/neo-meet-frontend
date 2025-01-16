import { SignedIn, SignedOut, ClerkLoading, ClerkLoaded } from "clerk-solidjs";
import { Router, Route } from "@solidjs/router";
import Home from "./pages/Home";
import Room from "./pages/Room";
import Main from "./components/publicRoute/Main";
import { LoadingState } from "./components/ui/loadingState";

function App() {
  return (
    <div>
      <ClerkLoading>
        <LoadingState></LoadingState>
      </ClerkLoading>
      <ClerkLoaded>
        <SignedIn>
          <Router>
            <Route path="/" component={Home} />
            <Route path="/room/:room_id" component={Room} />
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
