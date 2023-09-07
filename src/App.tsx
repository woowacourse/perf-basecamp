import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const Search = lazy(() => import(/* webpackChunkName: "search" */ './pages/Search/Search'));

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import './App.css';
import { Suspense, lazy, useEffect } from 'react';
import HelpPanel from './pages/Search/components/HelpPanel/HelpPanel';
import Home from './pages/Home/Home';

const App = () => {
  useEffect(() => {
    const deleteCache = async () => {
      await caches.delete('gifList');
    };

    deleteCache();
  }, []);

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/search"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Search>
                <HelpPanel />
              </Search>
            </Suspense>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
