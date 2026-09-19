import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import './App.css';

const Home = lazy(async () => await import('./pages/Home/Home'));
const Search = lazy(async () => await import('./pages/Search/Search'));

const App = () => {
  return (
    // <Router>
    <Suspense fallback={<div>로딩중</div>}>
      <Router basename={'/perf-basecamp'}>
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
