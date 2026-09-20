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

const App = () => {
  return (
    <Router>
      <NavBar />
      <Suspense
        fallback={
          <div style={{ minHeight: '100vh', textAlign: 'center', padding: '50px' }}>Loading...</div>
        }
      >
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
