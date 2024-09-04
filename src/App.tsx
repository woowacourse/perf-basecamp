import './App.css';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import NavBar from './components/NavBar/NavBar';

const Search = lazy(() => import('./pages/Search/Search'));
const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/search"
          element={
            <Suspense fallback={<Home />}>
              <Search />
            </Suspense>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
