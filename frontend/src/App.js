import logo from './logo.svg';
import './App.css';
import Start from './pages/startPage/start';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Game from './pages/track/game';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </Router>
  );
}


export default App;
