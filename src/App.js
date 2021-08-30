import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.css';

const Home = lazy(() => import(/* webpackChunkName: "Home" */ './pages/Home/Home'));
const Search = lazy(() => import(/* webpackChunkName: "Search" */ './pages/Search/Search'));

const App = () => {
  return (
    <Router>
      <Switch>
        <Suspense fallback={<div>loading...</div>}>
          <Route exact path="/" component={Home} />
          <Route exact path="/search" component={Search} />
        </Suspense>
      </Switch>
    </Router>
  );
};

export default App;
