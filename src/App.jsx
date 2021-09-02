import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './pages/Home/Home';
import './App.css';
import { GifSearchContextProvider } from './contexts/GifSearch';

window.onload = function () {
  import(/* webpackChunkName: "service_fetchGif" */ './service/fetchGif');
};

const SearchPage = React.lazy(() =>
  import(/* webpackChunkName: "page_Search" */ './pages/Search/Search')
);

const SearchPageSuspense = () => {
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <SearchPage />
    </Suspense>
  );
};

const App = () => {
  return (
    <Router>
      <GifSearchContextProvider>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/search">
            <SearchPageSuspense />
          </Route>
        </Switch>
      </GifSearchContextProvider>
    </Router>
  );
};

export default App;
