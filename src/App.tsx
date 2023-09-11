import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import React, { Suspense } from 'react';

const Home = React.lazy(() => import(/* webpackChunkName: "home" */ './pages/Home/Home'));
const Search = React.lazy(() => import(/* webpackChunkName: "search" */ './pages/Search/Search'));

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import './App.css';

const App = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
        </Routes>
        <Footer />
      </Suspense>
    </Router>
  );
};

export default App;
