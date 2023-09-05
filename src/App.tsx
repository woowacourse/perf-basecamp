import React, { Suspense } from 'react';
import { Outlet, RouterProvider } from 'react-router-dom';

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import { createBrowserRouter } from 'react-router-dom';

import './App.css';

import Home from './pages/Home/Home';
const Search = React.lazy(() => import('./pages/Search/Search'));

const RootLayout = () => {
  return (
    <>
      <NavBar />
      <Suspense fallback={<div>로딩중 ...</div>}>
        <Outlet />
      </Suspense>
      <Footer />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'search',
        element: <Search />
      }
    ]
  }
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
