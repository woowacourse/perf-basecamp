import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home/Home';

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import './App.css';
import { Suspense, lazy } from 'react';

const Search = lazy(() => import('./pages/Search/Search'));

const SearchPageWithSuspense = () => (
  <Suspense fallback={<div>loading...</div>}>
    <Search />
  </Suspense>
);

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchPageWithSuspense />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
