import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { logger } from "redux-logger";
import { createStore, applyMiddleware } from "redux";
import configureStore from "./store/configureStore";
import AppRouter from "./routers/AppRouter";
import rootReducer from "./reducers";
import io from "socket.io-client";
import emmiter from "./emmiter";
import "normalize.css/normalize.css";
import "./styles/style.scss";

export const socket = io();

// const middleware = applyMiddleware(logger);
const store = createStore(rootReducer);

emmiter(socket, store);

const app = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));
