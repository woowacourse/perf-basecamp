import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import './App.css';
import React from 'react';

const Home = React.lazy(() => import('./pages/Home/Home'));
const Search = React.lazy(() => import('./pages/Search/Search'));

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={
            <React.Suspense fallback={<>loading...</>}>
              <Home />
            </React.Suspense>
          }
        />
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
