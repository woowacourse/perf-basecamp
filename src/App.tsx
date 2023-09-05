import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import './App.css';
import { lazy, Suspense } from 'react';

const App = () => {
  const Home = lazy(() => import('./pages/Home/Home'));
  const Search = lazy(() => import('./pages/Search/Search'));

  return (
    <Router basename={'/perf-basecamp'}>
      <NavBar />
      <Suspense fallback={<div>loading...</div>}>
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
