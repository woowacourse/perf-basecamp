import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home/Home';

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import './App.css';

const Search = React.lazy(() => import('./pages/Search/Search'));

const App = () => {
  return (
    // <Router>
    <Router basename={'/perf-basecamp'}>
      <NavBar />
      <Suspense fallback={<div>로딩중</div>}>
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
