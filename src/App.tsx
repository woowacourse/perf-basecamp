import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import './App.css';

const Search = lazy(() => import(/* webpackChunkName: "searchPage" */ './pages/Search/Search'));
const Home = lazy(() => import(/* webpackChunkName: "homePage" */ './pages/Home/Home'));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<div className={'content-fallback'}>loading...</div>}>
        <NavBar />
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
