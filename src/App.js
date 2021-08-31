import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './pages/Home/Home';

import './App.css';

const SearchPage = React.lazy(() => import('./pages/Search/Search'));

const SearchPageSuspense = () => {
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <SearchPage />
    </Suspense>
  );
};

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/search" component={SearchPageSuspense} />
      </Switch>
    </Router>
  );
};

export default App;
