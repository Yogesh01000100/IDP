import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import LoginForm from './components/adminComponent/sampleComponent';

const BaseRoute = () => (
  <Routes>
    <Route exact path="/user/login" element={<LoginForm/>} />
  </Routes>
);

export default BaseRoute;