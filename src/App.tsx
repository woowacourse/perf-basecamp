import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import './App.css';
import React from 'react';

const SearchPage = React.lazy(() => import('./pages/Search/Search'));
const Home = React.lazy(() => import('./pages/Home/Home'));

const SearchPageWithLazy = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <SearchPage />
    </React.Suspense>
  );
};

const HomePageWithLazy = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Home />
    </React.Suspense>
  );
};

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePageWithLazy />} />
        <Route path="/search" element={<SearchPageWithLazy />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
