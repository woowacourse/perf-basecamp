import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './pages/Home/Home';

import './App.css';
import { fetchTrendingGifs } from './service/fetchGif';

const SearchPage = React.lazy(() => import('./pages/Search/Search'));

const SearchPageSuspense =
  ({ trendingGifs }) =>
  () => {
    return (
      <Suspense fallback={<div>로딩중...</div>}>
        <SearchPage trendingGifs={trendingGifs} />
      </Suspense>
    );
  };

const App = () => {
  const [trendingGifs, setTrendingGifs] = useState([]);

  useEffect(async () => {
    const gifs = await fetchTrendingGifs();

    setTrendingGifs(gifs);
  }, []);

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/search" component={SearchPageSuspense({ trendingGifs })} />
      </Switch>
    </Router>
  );
};

export default App;
