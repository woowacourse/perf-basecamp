import { lazy } from 'react';
import type { ComponentType } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppFrame from './AppFrame';

import './assets/fonts/fonts.css';
import './assets/fonts/search-ui.css';
import './App.css';

export const loadSearchPage = async (): Promise<typeof import('./pages/Search/Search')> => {
  // Fetch data alongside the page chunk; useGifSearch reuses the in-flight request.
  void import(/* webpackChunkName: "giphy-api" */ './apis/gifAPIService')
    .then(async ({ gifAPIService }) => await gifAPIService.getTrending())
    .catch(() => {
      // The page handles request errors and retries through useGifSearch.
    });

  return await import(/* webpackChunkName: "search" */ './pages/Search/Search');
};

const Search = lazy(loadSearchPage);

interface AppProps {
  SearchComponent?: ComponentType;
}

const App = ({ SearchComponent = Search }: AppProps): JSX.Element => {
  return (
    <Router basename={process.env.PUBLIC_PATH ?? '/'}>
      <AppFrame SearchComponent={SearchComponent} />
    </Router>
  );
};

export default App;
