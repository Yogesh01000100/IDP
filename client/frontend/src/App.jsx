import "./App.css";
import BaseRoute from './routes';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {

  return (
    <Router>
      <BaseRoute />
    </Router>
  );
}

export default App;
