import { Route, Routes, HashRouter } from 'react-router-dom';

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import './App.css';
import { lazy, Suspense } from 'react';
import Home from './pages/Home/Home';

const Search = lazy(() => import('./pages/Search/Search'));

const App = () => {
  return (
    <HashRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/search"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Search />
            </Suspense>
          }
        />
      </Routes>
      <Footer />
    </HashRouter>
  );
};

export default App;
