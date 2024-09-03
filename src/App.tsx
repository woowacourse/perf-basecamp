import './App.css';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import NavBar from './components/NavBar/NavBar';
import Search from './pages/Search/Search';

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
