import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home/Home';

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import './App.css';

const Search = lazy(() => import('./pages/Search/Search'));

const SearchSuspense = () => {
  return (
    <Suspense fallback={<>Loading 중...</>}>
      <Search />
    </Suspense>
  );
};

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchSuspense />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
