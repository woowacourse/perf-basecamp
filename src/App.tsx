import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// import Home from './pages/Home/Home';
// import Search from './pages/Search/Search';

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

const Home = lazy(() => import('./pages/Home/Home'));
const Search = lazy(() => import('./pages/Search/Search'));

import './App.css';

const App = () => {
  return (
    <Router>
      <NavBar />
      <Suspense fallback={<div style={{ width: '100vw', height: '100vh' }} />}>
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
