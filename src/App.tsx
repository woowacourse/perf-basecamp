import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home/Home'));
const Search = lazy(() => import('./pages/Search/Search'));

import Footer from './components/Footer/Footer';
import NavBar from './components/NavBar/NavBar';

import { lazy, Suspense } from 'react';
import './App.css';

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<div>"Loading..."</div>}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/search"
          element={
            <Suspense fallback={<div>"Loading..."</div>}>
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
