import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home/Home'));
const Search = lazy(() => import('./pages/Search/Search'));

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import './App.css';

const App = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
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
