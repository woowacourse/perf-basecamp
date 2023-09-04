import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import './App.css';
import { Suspense, lazy } from 'react';
import Home from './pages/Home/Home';
const Search = lazy(() => import(/* webpackChunkName: "Search" */ './pages/Search/Search'));

const isDevMode = process.env.NODE_ENV === 'development';

const App = () => {
  return (
    <Router basename={isDevMode ? '' : '/perf-basecamp'}>
      <NavBar />
      <Suspense fallback={<div>Load + ing...</div>}>
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
