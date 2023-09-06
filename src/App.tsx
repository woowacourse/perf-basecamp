import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

const Home = lazy(() => import(/* webpackChunkName: "Home" */ './pages/Home/Home'));
const Search = lazy(() => import(/* webpackChunkName: "Search" */ './pages/Search/Search'));

import './App.css';

const App = () => {
  return (
    <Router basename={'/perf-basecamp'}>
      <NavBar />
      <div style={{ minHeight: '100vh' }}>
        <Suspense fallback={<div>로딩 중입니다..</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
