import React, { lazy, Suspense, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./App.css";

const Home = lazy(() => import("./pages/Home/Home"));
const Search = lazy(() => import("./pages/Search/Search"));

const App = () => {
  const [trendingGifs, setTrendingGifs] = useState(null);

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/search">
            <Search
              trendingGifs={trendingGifs}
              setTrendingGifs={setTrendingGifs}
            />
          </Route>
        </Switch>
      </Suspense>
    </Router>
  );
};

export default App;
