import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const Search = lazy(() => import('./pages/Search/Search'));

import Home from './pages/Home/Home';
import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import './App.css';
import { lazy, Suspense } from 'react';

const App = () => {
  return (
    <Router>
      <NavBar />
      <Suspense fallback={<div>Loading ...</div>}>
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
