import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import './App.css';
import { Suspense, lazy } from 'react';
import Home from './pages/Home/Home';
import Loading from './components/Loading/Loading';
const Search = lazy(() => import(/* webpackChunkName: "Search" */ './pages/Search/Search'));

const isDevMode = process.env.NODE_ENV === 'development';
const App = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Router basename={isDevMode ? '' : '/perf-basecamp'}>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
        </Routes>
        <Footer />
      </Router>
    </Suspense>
  );
};

export default App;
