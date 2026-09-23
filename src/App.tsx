import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home/Home';

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import './assets/fonts/fonts.css';
import './App.css';

const Search = lazy(async () => await import('./pages/Search/Search'));

const App = (): JSX.Element => {
  return (
    <Router basename={process.env.PUBLIC_PATH ?? '/'}>
      <NavBar />
      <Suspense
        fallback={
          <main style={{ minHeight: '90vh', paddingTop: '5rem' }} role="status">
            Loading…
          </main>
        }
      >
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
