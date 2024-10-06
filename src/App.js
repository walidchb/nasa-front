import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Apod from './pages/Apod.tsx';
import MarsRover from './pages/MarsRover.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/apod" replace />} />

        <Route path="/apod" element={<Apod />} />
        <Route path="/mars-rover" element={<MarsRover />} />
      </Routes>
    </Router>
  );
}

export default App;
