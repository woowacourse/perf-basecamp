import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import './App.css';
import { Suspense, lazy, useEffect } from 'react';
import { TRENDING_GIF_API } from './apis/gifAPIService';

const Home = lazy(() => import('./pages/Home/Home'));
const Search = lazy(() => import('./pages/Search/Search'));

const App = () => {
  useEffect(() => {
    const clearCacheStorage = async () => {
      const cache = await caches.open('trending');
      cache.delete(TRENDING_GIF_API);
    };

    window.addEventListener('beforeunload', clearCacheStorage);

    return () => {
      window.removeEventListener('beforeunload', clearCacheStorage);
    };
  }, []);

  return (
    <Router>
      <Suspense fallback={<div>Loading ...</div>}>
        <NavBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/search' element={<Search />} />
        </Routes>
        <Footer />
      </Suspense>
    </Router>
  );
};

export default App;
