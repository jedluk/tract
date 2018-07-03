import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { logger } from "redux-logger";
import { createStore, applyMiddleware } from "redux";
import configureStore from "./store/configureStore";
import AppRouter from "./routers/AppRouter";
import rootReducer from "./reducers";
import io from "socket.io-client";
import { setReadyImage } from "./actions/img";
import "normalize.css/normalize.css";
import "./styles/style.scss";

export const socket = io();

const middleware = applyMiddleware(logger);
const store = createStore(rootReducer, middleware);

socket.on("finished processing", (data) =>{
  const { outImgName: name } = data;
  store.dispatch(setReadyImage(name))
});

const app = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));
