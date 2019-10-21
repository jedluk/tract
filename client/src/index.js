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
import 'react-fontawesome';

const DEV_MODE = process.env.NODE_ENV === 'development';
const store = createStore(rootReducer, DEV_MODE ? applyMiddleware(logger) : undefined);

export const socket = null; //io(`ws://${DEV_MODE ? 'localhost' : 'cv_worker'}:6083`);
// emmiter(socket, store);

const app = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
