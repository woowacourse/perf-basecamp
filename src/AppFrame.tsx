import { Suspense } from 'react';
import type { ComponentType } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Home from './pages/Home/Home';
import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';
import styles from './AppFrame.module.css';

interface AppFrameProps {
  SearchComponent: ComponentType;
}

const AppFrame = ({ SearchComponent }: AppFrameProps): JSX.Element => {
  const { pathname } = useLocation();
  const isSearch = pathname.replace(/\/+$/, '').toLowerCase() === '/search';

  return (
    <div className={isSearch ? styles.searchFrame : undefined}>
      <NavBar />
      <Suspense
        fallback={
          <main style={{ minHeight: '100vh', paddingTop: '5rem' }} role="status">
            Loading…
          </main>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchComponent />} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  );
};

export default AppFrame;
