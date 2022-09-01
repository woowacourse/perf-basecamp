import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import './App.css';
import React from 'react';
import Home from './pages/Home/Home';

const Search = React.lazy(() => import('./pages/Search/Search'));

const App = () => {
  return (
    <React.Suspense fallback={<div>로딩중..</div>}>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
        </Routes>
        <Footer />
      </Router>
    </React.Suspense>
  );
};

export default App;
