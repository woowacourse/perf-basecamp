import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Old approach for getting URL
// import webp from './assets/images/hero.jpg?as=webp';

// Assets modules
// console.log(new URL('./assets/images/hero.png?as=webp'));

import Home from './pages/Home/Home';
import Search from './pages/Search/Search';

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

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
