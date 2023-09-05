import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home/Home';
import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';
const Search = lazy(() => import('./pages/Search/Search'));

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
      <Footer />
    </Router>
  );
};

export default App;
