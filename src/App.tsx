import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

/* webpackChunkName: "home" */ import Home from './pages/Home/Home';
const Search = lazy(() => import(/* webpackChunkName: "search" */ './pages/Search/Search'));

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import './App.css';
import { Suspense, lazy } from 'react';
import HelpPanel from './pages/Search/components/HelpPanel/HelpPanel';

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Suspense fallback={<div>Loading...</div>}>
          <Route
            path="/search"
            element={
              <Search>
                <HelpPanel />
              </Search>
            }
          />
        </Suspense>
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
