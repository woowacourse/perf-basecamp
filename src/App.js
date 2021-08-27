import React, { Suspense } from "react";
import NavBar from "./components/NavBar/NavBar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const Home = React.lazy(() => import("./pages/Home/Home"));
const Search = React.lazy(() => import("./pages/Search/Search"));

import "./App.css";
import Footer from "./components/Footer/Footer";

const App = () => {
  return (
    <>
      <Router>
        <NavBar />
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
        <Footer />
      </Router>
    </>
  );
};

export default App;
