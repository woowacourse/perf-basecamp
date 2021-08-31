import './App.css';

import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import React from 'react';
import TrendingGifsProvider from './contexts/TrendingGifsProvider';
import loadable from '@loadable/component';

const Home = loadable(() => import('./pages/Home/Home'));
const Search = loadable(() => import('./pages/Search/Search'));

const App = () => {
  return (
    <Router>
      <TrendingGifsProvider>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/search" component={Search} />
        </Switch>
      </TrendingGifsProvider>
    </Router>
  );
};

export default App;
