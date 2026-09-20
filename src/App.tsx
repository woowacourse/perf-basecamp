import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home/Home';
import Search from './pages/Search/Search';

import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import './App.css';

// GitHub Pages는 https://<user>.github.io/<repo>/ 로 서빙되므로
// 프로덕션 빌드에서만 리포지토리 이름을 basename으로 넣어준다.
const BASENAME = process.env.NODE_ENV === 'production' ? '/perf-basecamp' : '/';

const App = () => {
  return (
    <Router basename={BASENAME}>
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
