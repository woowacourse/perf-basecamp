import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const Home = React.lazy(() => import("./pages/Home/Home"));
const Search = React.lazy(() => import("./pages/Search/Search"));

import "./App.css";

const App = () => {
  return (
    <Router>
      <Suspense fallback>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/search" component={Search} />
        </Switch>
      </Suspense>
    </Router>
  );
};

export default App;
