import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Home from './pages/Home/Home';
import Search from './pages/Search/Search';

import Footer from './components/Footer/Footer';
import NavBar from './components/NavBar/NavBar';

import './App.css';

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
