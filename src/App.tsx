import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import Home from './pages/Home/Home';
import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import './App.css';

const Search = lazy(() => import(/* webpackChunkName: "search" */ './pages/Search/Search'));

const App = () => {
  // GitHub Pages: REACT_APP_BASENAME, CloudFront: ''
  const basename = process.env.REACT_APP_BASENAME || '';

  return (
    <Router basename={basename}>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
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
