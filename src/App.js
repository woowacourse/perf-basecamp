import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./App.css";

const HomePage = lazy(() => import("./pages/Home/Home"));
const SearchPage = lazy(() => import("./pages/Search/Search"));

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
