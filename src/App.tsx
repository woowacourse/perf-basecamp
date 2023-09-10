import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';
const Search = lazy(() => import('./pages/Search/Search'));
const Home = lazy(() => import('./pages/Home/Home'));

import './App.css';
import { ROUTE_PATH } from './constants/pageRoute';
import Loading from './components/Loading/Loading';

const App = () => {
  return (
    <Router>
      <NavBar />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path={ROUTE_PATH.MAIN_PAGE} element={<Home />} />
          <Route path={ROUTE_PATH.SEARCH_PAGE} element={<Search />} />
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
};

export default App;
