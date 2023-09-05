import { lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const Search = lazy(() => import('./pages/Search/Search'));
const Home = lazy(() => import('./pages/Home/Home'));

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import './App.css';

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
