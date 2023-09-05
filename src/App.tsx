import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home/Home';
import NavBar from './components/NavBar/NavBar';
const Search = lazy(() => import('./pages/Search/Search'));
const Footer = lazy(() => import('./components/Footer/Footer'));

import './App.css';

const ComponentSuspense = (component: JSX.Element) => {
  return <Suspense fallback={<>로딩중</>}>{component}</Suspense>;
};

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={ComponentSuspense(<Search />)} />
      </Routes>
      {ComponentSuspense(<Footer />)}
    </Router>
  );
};

export default App;
