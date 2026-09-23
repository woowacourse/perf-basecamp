import { Suspense } from 'react';
import type { ComponentType } from 'react';
import { Route, Routes } from 'react-router-dom';

import Home from './pages/Home/Home';
import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

interface AppFrameProps {
  SearchComponent: ComponentType;
}

const AppFrame = ({ SearchComponent }: AppFrameProps): JSX.Element => {
  return (
    <>
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
    </>
  );
};

export default AppFrame;
