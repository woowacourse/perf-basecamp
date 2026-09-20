import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import Home from './pages/Home/Home';
const Search = lazy(() => import('./pages/Search/Search'));

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import './App.css';

const GITHUB_PAGES_BASENAME = '/perf-basecamp';

const getBasename = (): string | undefined =>
  window.location.pathname.startsWith(GITHUB_PAGES_BASENAME) ? GITHUB_PAGES_BASENAME : undefined;

const App = () => {
  return (
    <Suspense fallback={null}>
      <Router basename={getBasename()}>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
        </Routes>
        <Footer />
      </Router>
    </Suspense>
  );
};

export default App;
