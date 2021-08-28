import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer/Footer";
import NavBar from "./components/NavBar/NavBar";
import Home from "./pages/Home/Home";
import { SearchLoadable } from "./pages/Loadable";
import Loading from "./pages/Loading";

const App = () => {
  return (
    <Router>
      <NavBar />
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/search" component={SearchLoadable} />
        </Switch>
      </Suspense>
      <Footer />
    </Router>
  );
};

export default App;
