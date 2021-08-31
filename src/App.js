import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const Home = lazy(() =>
  import(/* webpackChunkName: "Home" */ "./pages/Home/Home"),
);
const Search = lazy(() =>
  import(/* webpackChunkName: "Search" */ "./pages/Search/Search"),
);

import "./App.css";

const App = () => {
  return (
    <Suspense fallback={<div>...Loading</div>}>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/search" component={Search} />
        </Switch>
      </Router>
    </Suspense>
  );
};

export default App;
