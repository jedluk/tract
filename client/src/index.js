import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { logger } from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './redux/rootReducer';
import AppRouter from './router/AppRouter';
import io from 'socket.io-client';
import emmiter from './redux/emmiter';
import './styles/style.scss';

const store = createStore(
  rootReducer,
  process.env.NODE_ENV === 'development' ? applyMiddleware(logger) : undefined
);

export const socket = io();
emmiter(socket, store);

const app = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
