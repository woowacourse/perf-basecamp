import './App.css';

import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import React from 'react';
import loadable from '@loadable/component';

const Home = loadable(() => import('./pages/Home/Home'));
const Search = loadable(() => import('./pages/Search/Search'));

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/search" component={Search} />
      </Switch>
    </Router>
  );
};

export default App;
