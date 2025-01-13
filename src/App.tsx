import './index.css';

import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import { AuthProvider } from './components/AuthContext';
import { Index } from './pages/Index';
import { Login } from './pages/Login';
import CommentList from './pages/movie/CommentList';
import ReplyPage from './pages/movie/CommentPage';
import { MoviePage } from './pages/movie/MoviePage';
import { Movies } from './pages/Movies';
import { MyPage } from './pages/mypage/MyPage';
import { Settings } from './pages/mypage/Settings';
import { News } from './pages/News';
import PeoplePage from './pages/PeoplePage';
import { Rating } from './pages/Rating';
import { Signup } from './pages/Signup';

export const App = () => {
  useEffect(() => {
    // Check if the page has already been refreshed
    const hasRefreshed = localStorage.getItem('hasRefreshed');

    if (hasRefreshed === null || hasRefreshed === '') {
      // If not, reload the page
      localStorage.setItem('hasRefreshed', 'true');
      window.location.reload();
    }
  }, []);

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
          <Route path="/movies/:movieId/comments" element={<CommentList />} />
          <Route path="/people/:peopleId" element={<PeoplePage />} />
          <Route path="/comments/:commentId" element={<ReplyPage />} />
        </Routes>
      </AuthProvider>
    </div>
  );
};
