import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home/Home';

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import './assets/fonts/fonts.css';
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

const App = (): JSX.Element => {
  return (
    <Router basename={process.env.PUBLIC_PATH ?? '/'}>
      <NavBar />
      <Suspense
        fallback={
          <main style={{ minHeight: '90vh', paddingTop: '5rem' }} role="status">
            Loading…
          </main>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
};

export default App;
