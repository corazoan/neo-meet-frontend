/* @refresh reload */
import { render } from "solid-js/web";
import "./index.css";
import App from "./App.tsx";
import { ClerkProvider, GoogleOneTap } from "clerk-solidjs";

const root = document.getElementById("root");

render(
  () => (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <GoogleOneTap />
      <App />
    </ClerkProvider>
  ),
  root!,
);
