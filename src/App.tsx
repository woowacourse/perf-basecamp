import React, { Suspense } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';

const Home = React.lazy(() => import('./pages/Home/Home'));
const Search = React.lazy(() => import('./pages/Search/Search'));

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

// @font-face는 PreloadFontsWebpackPlugin이 해시된 경로로 HTML에 주입합니다.
// 아래 import는 webpack이 폰트 파일을 emit하도록 트리거합니다.
import './assets/fonts/josefin-sans-normal.woff2';
import './assets/fonts/josefin-sans-italic.woff2';

import './App.css';

const App = () => {
  return (
    <Router>
      <NavBar />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
};

export default App;
