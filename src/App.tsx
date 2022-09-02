import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home/Home';

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import './App.css';
import React from 'react';

const Search = React.lazy(() => import('./pages/Search/Search'));

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/search"
          element={
            <React.Suspense fallback={<>loading...</>}>
              <Search />
            </React.Suspense>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
