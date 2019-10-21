import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { logger } from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './redux/rootReducer';
import AppRouter from './router/AppRouter';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import io from 'socket.io-client';
import './styles/style.scss';

const DEV_MODE = process.env.NODE_ENV === 'development';

const middleware = [logger, thunk];
const store = createStore(
  rootReducer,
  DEV_MODE ? composeWithDevTools(applyMiddleware(...middleware)) : applyMiddleware(thunk)
);

const { SOCKET_PORT = 6300 } = process.env;
export const socket = io(`http://localhost:${SOCKET_PORT}`);

const app = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
