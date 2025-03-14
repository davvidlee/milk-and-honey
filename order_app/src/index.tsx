import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { HashRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";

// Use HashRouter instead of BrowserRouter
// will allow gh-page to go across routes
// won't render 404 error on refresh
ReactDOM.render(
  <HashRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </HashRouter>,
  document.getElementById("root")
);
