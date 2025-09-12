import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import './App.css';

const Home = lazy(() => import('./pages/Home/Home'));
const Search = lazy(() => import('./pages/Search/Search'));

const LoadingSpinner = () => <div>Loading...</div>;

const App = () => {
  return (
    <Router>
      <NavBar />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
};

export default App;
