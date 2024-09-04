import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const Home = lazy(() => import('./types/Home'));
const Search = lazy(() => import('./pages/Search/Search'));

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import './App.css';
import { lazy, Suspense } from 'react';
import LoadingBar from './components/LoadingBar/LoadingBar';

const App = () => {
  return (
    <Router basename={'/'}>
      <NavBar />
      <Suspense fallback={<LoadingBar />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
        </Routes>
        <Footer />
      </Suspense>
    </Router>
  );
};

export default App;
