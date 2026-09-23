import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';

import './App.css';

const Search = React.lazy(
  () =>
    import(
      /* webpackChunkName: "search" */
      './pages/Search/Search'
    )
);

const SearchFallback = () => {
  return (
    <section className="searchFallback" aria-label="Search 페이지 불러오는 중">
      <div className="searchFallbackTitle" />
      <div className="searchFallbackBar">
        <div className="searchFallbackInput" />
        <div className="searchFallbackButton" />
      </div>
    </section>
  );
};

const App = () => {
  return (
    <Router>
      <div className="appShell">
        <NavBar />
        <main className="routeContent">
          <Suspense fallback={<SearchFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
