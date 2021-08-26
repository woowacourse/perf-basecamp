import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const Home = React.lazy(() => import("./pages/Home/Home"));
const Search = React.lazy(() => import("./pages/Search/Search"));

import "./App.css";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Suspense fallback={null}>
            <Home />
          </Suspense>
        </Route>
        <Route exact path="/search">
          <Suspense fallback={null}>
            <Search />
          </Suspense>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
