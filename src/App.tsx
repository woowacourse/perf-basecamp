import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home/Home';

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import './App.css';

const Search = lazy(() => import('./pages/Search/Search'));

const App = () => {
  return (
    <Router>
      <NavBar />
      <Suspense fallback={<p>로딩중..</p>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/search"
          element={
            <Search />
          }
        />
      </Routes>
      <Footer />
      </Suspense>
    </Router>
  );
};

export default App;
