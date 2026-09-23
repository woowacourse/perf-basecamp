import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import Home from './pages/Home/Home';

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './App.css';

const Search = lazy(() => import('./pages/Search/Search'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: Infinity,
      refetchOnWindowFocus: false
    }
  }
});

const App = (): React.JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/search"
            element={
              <Suspense fallback={null}>
                <Search />
              </Suspense>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </QueryClientProvider>
  );
};

export default App;
