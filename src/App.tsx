import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const Search = lazy(() => import(/* webpackChunkName: "search" */ './pages/Search/Search'));
const Home = lazy(() => import(/* webpackChunkName: "home" */ './pages/Home/Home'));

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import './App.css';
import { Suspense, lazy, useEffect } from 'react';
import HelpPanel from './pages/Search/components/HelpPanel/HelpPanel';

const App = () => {
  useEffect(() => {
    const deleteCache = async () => {
      await caches.delete('gifList');
    };

    deleteCache();
  }, []);

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/search"
            element={
              <Search>
                <HelpPanel />
              </Search>
            }
          />
        </Routes>
        <Footer />
      </Suspense>
    </Router>
  );
};

export default App;
