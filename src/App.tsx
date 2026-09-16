import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// import Home from './pages/Home/Home';
// import Search from './pages/Search/Search';

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import './App.css';

const Home = React.lazy(
  () =>
    import(
      /* webpackChunkName: "home" */
      './pages/Home/Home'
    )
);

const Search = React.lazy(
  () =>
    import(
      /* webpackChunkName: "search" */
      /* webpackPrefetch: true */
      './pages/Search/Search'
    )
);

const App = () => {
  return (
    <Router>
      <NavBar />
      <Suspense fallback={<div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>}>
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
