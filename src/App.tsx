import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import './App.css';

const App = () => {
  const basename = process.env.BASENAME;
  const Home = lazy(() => /* webpackChunkName: "home" */ import('./pages/Home/Home'));
  const Search = lazy(() => /* webpackChunkName: "search" */ import('./pages/Search/Search'));

  return (
    <Router basename={basename}>
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/search"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Search />
            </Suspense>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
