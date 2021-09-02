import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './pages/Home/Home';
import { SearchLoadable } from './pages/Loadable/Loadable';

import './App.css';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/search" component={SearchLoadable} />
      </Switch>
    </Router>
  );
};

export default App;
