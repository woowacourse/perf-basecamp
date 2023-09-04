import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import './App.css';
import React, { Suspense } from 'react';

const Home = React.lazy(() => import(/* webpackChunkName: "home" */ './pages/Home/Home'));
const Search = React.lazy(() => import(/* webpackChunkName: "search" */ './pages/Search/Search'));

const App = () => {
  return (
    <Router>
      <NavBar />
      <Suspense>
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
