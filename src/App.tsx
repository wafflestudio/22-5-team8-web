import './index.css';

import { Route, Routes } from 'react-router-dom';

import { AuthProvider } from './components/AuthContext';
import { Index } from './pages/Index';
import { Login } from './pages/Login';
import { MoviePage } from './pages/movie/MoviePage';
import { Movies } from './pages/Movies';
import { MyPage } from './pages/mypage/MyPage';
import { Settings } from './pages/mypage/Settings';
import { News } from './pages/News';
import { Rating } from './pages/Rating';
import { Signup } from './pages/Signup';

export const App = () => {
  return (
    <div>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:movieId" element={<MoviePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />\
          <Route path="/rating" element={<Rating />} />
          <Route path="/news" element={<News />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/mypage/settings" element={<Settings />} />
        </Routes>
      </AuthProvider>
    </div>
  );
};
