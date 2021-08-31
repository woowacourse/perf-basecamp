import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const HomePage = lazy(() => import("./pages/Home/Home"));
const SearchPage = lazy(() => import("./pages/Search/Search"));

import "./App.css";

const App = () => {
  return (
    <Router>
      <Switch>
        <Suspense fallback={<p>Loading</p>}>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/search" component={SearchPage} />
        </Suspense>
      </Switch>
    </Router>
  );
};

export default App;
