import './App.css';

import React, { Suspense } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

const Search = React.lazy((_) => import('./pages/Search/Search'));
const Home = React.lazy((_) => import('./pages/Home/Home'));

const App = () => {
  return (
    <Router>
      <Switch>
        <Suspense fallback={<div>loading..</div>}>
          <Route exact path='/' component={Home} />
          <Route exact path='/search' component={Search} />
        </Suspense>
      </Switch>
    </Router>
  );
};

export default App;
