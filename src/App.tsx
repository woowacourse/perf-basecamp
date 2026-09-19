import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home/Home';

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import './App.css';

const GITHUB_PAGES_BASENAME = '/perf-basecamp';
const Search = lazy(async () => import('./pages/Search/Search'));

const App = () => {
  const basename = window.location.pathname.startsWith(GITHUB_PAGES_BASENAME)
    ? GITHUB_PAGES_BASENAME
    : undefined;

  return (
    <Router basename={basename}>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/search"
          element={
            <Suspense
              fallback={
                <div role="status" className="searchRouteFallback">
                  Loading search...
                </div>
              }
            >
              <Search />
            </Suspense>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
