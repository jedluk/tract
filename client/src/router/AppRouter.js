import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Gallery from '../components/Gallery';
import NotFoundPage from '../components/NotFoundPage';
import MainView from '../components/MainView';

export default () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" component={MainView} exact={true} />
      <Route path="/gallery" component={Gallery} exact={true} />
      <Route component={NotFoundPage} />
    </Switch>
  </BrowserRouter>
);
