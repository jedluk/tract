import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { logger } from "redux-logger";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./redux/rootReducer";
import AppRouter from "./router/AppRouter";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import "./styles/style.scss";

const { NODE_ENV } = process.env;

const middleware = [logger, thunk];
export const store = createStore(
  rootReducer,
  NODE_ENV === "development"
    ? composeWithDevTools(applyMiddleware(...middleware))
    : applyMiddleware(thunk)
);

const app = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));
