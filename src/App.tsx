import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const Home = React.lazy(() => import('./pages/Home/Home'));
const Search = React.lazy(() => import('./pages/Search/Search'));

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <NavBar />
        <main className="main-content">
          <Suspense fallback={<div>페이지 로딩 중...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
