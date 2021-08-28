import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import loadable from '@loadable/component';

const Home = loadable(() => import('./pages/Home/Home'));
const Search = loadable(() => import('./pages/Search/Search'));

import './App.css';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/search' component={Search} />
      </Switch>
    </Router>
  );
};

export default App;
