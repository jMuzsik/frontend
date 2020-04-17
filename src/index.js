import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import * as history from "history";

import AuthWrapper from "./TopLevel/Auth";
import ThemeWrapper from "./TopLevel/Theme";
import App from "./TopLevel/App";

import "./index.css";

import * as serviceWorker from "./serviceWorker";

const createHistory = history.createBrowserHistory;
const browserHistory = createHistory();

ReactDOM.render(
  <Router history={browserHistory}>
    <AuthWrapper>
      <ThemeWrapper>
        <App />
      </ThemeWrapper>
    </AuthWrapper>
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
