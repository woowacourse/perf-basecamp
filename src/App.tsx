import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home/Home';
import NavBar from './components/NavBar/NavBar';
const Search = lazy(() => import('./pages/Search/Search'));
const Footer = lazy(() => import('./components/Footer/Footer'));

import './App.css';

const App = () => {
  return (
    <Router>
      <Suspense fallback={<></>}>
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
