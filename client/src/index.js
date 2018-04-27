import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import 'normalize.css/normalize.css';
import './styles/style.scss';

// place for provider and router
const jsx = <App />

ReactDOM.render(jsx, document.getElementById('root'));