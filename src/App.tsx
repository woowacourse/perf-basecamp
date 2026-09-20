import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { Suspense } from 'react';

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';

import './App.css';

// Home is the landing route - a lazy chunk would only add a round trip before the hero can render.
const Search = React.lazy(() => import('./pages/Search/Search'));

const App = () => {
  return (
    <Suspense fallback={<p>페이지를 불러오는 중</p>}>
      <Router>
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
