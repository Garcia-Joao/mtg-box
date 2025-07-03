import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Cards from './pages/Cards';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cards/:setCode" element={<Cards />} />
      </Routes>
    </Router>
  );
}

export default App;
