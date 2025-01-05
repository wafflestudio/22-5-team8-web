import './index.css';

import { Route, Routes } from 'react-router-dom';

import { Index } from './pages/Index';
import { Login } from './pages/Login';
import { Movies } from './pages/Movies';
import { Signup } from './pages/Signup';

export const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
};
