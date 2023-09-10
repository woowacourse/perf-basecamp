import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home/Home';
import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';
const Search = lazy(() => import('./pages/Search/Search'));

import './App.css';
import { ROUTE_PATH } from './constants/pageRoute';
import Loading from './components/Loading/Loading';

const ComponentSuspense = (component: JSX.Element) => {
  return <Suspense fallback={<Loading />}>{component}</Suspense>;
};

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path={ROUTE_PATH.MAIN_PAGE} element={<Home />} />
        <Route path={ROUTE_PATH.SEARCH_PAGE} element={ComponentSuspense(<Search />)} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
