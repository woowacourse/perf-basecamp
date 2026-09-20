import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

import './App.css';

const Home = lazy(() => import(/* webpackChunkName: "home" */ './pages/Home/Home'));
const Search = lazy(() => import(/* webpackChunkName: "search" */ './pages/Search/Search'));

const App = () => {
  return (
    <Router>
      <NavBar />
      <ErrorBoundary>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <Footer />
    </Router>
  );
};

export default App;
