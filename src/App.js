import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const Home = React.lazy(() =>
  import(/* webpackChunkName: "home" */ "./pages/Home/Home")
);
const Search = React.lazy(() =>
  import(/* webpackChunkName: "search" */ "./pages/Search/Search")
);

import "./App.css";
import GlobalStateProvider from "./contexts/GlobalStateProvider";

const App = () => {
  return (
    <Router>
      <Switch>
        <GlobalStateProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/search">
              <Search />
            </Route>
          </Suspense>
        </GlobalStateProvider>
      </Switch>
    </Router>
  );
};

export default App;
