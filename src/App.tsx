import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home/Home'));
const Search = lazy(() => import('./pages/Search/Search'));

import NavBar from './components/NavBar/NavBar';

const Footer = lazy(() => import('./components/Footer/Footer'));

import { lazy, Suspense } from 'react';
import './App.css';

const App = () => {
  return (
    <Router>
      <NavBar />
      <Suspense fallback={<div>"Loading..."</div>}>
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
