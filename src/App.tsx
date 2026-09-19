import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// import Home from './pages/Home/Home';
// import Search from './pages/Search/Search';

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

const Home = lazy(() => import('./pages/Home/Home'));
const Search = lazy(() => import('./pages/Search/Search'));

import './App.css';

const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router basename={'/perf-basecamp'}>
        {/* <Router> */}
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
        </Routes>
        <Footer />
      </Router>
    </Suspense>
  );
};

export default App;
