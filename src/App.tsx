import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home/Home';

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import './App.css';

// Home 진입 시 Search 코드를 받지 않도록 라우트 단위로 분리
const Search = lazy(
  async () => await import(/* webpackChunkName: "search" */ './pages/Search/Search')
);

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/search"
          element={
            <Suspense fallback={<p>검색 페이지 불러오는 중..</p>}>
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
