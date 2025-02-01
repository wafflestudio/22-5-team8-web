import './index.css';

import { Route, Routes } from 'react-router-dom';

import { AuthProvider } from './components/AuthContext';
import { ReturnPathProvider } from './components/ReturnPathContext';
import Analysis from './pages/analysis/Analysis';
import CollectionPage from './pages/collection/CollectionPage';
import { Collections } from './pages/collection/Collections';
import { EditCollection } from './pages/collection/EditCollection';
import { NewCollection } from './pages/collection/NewCollection';
import { GoogleCallback } from './pages/GoogleCallback';
import { Index } from './pages/Index';
import { KakaoCallback } from './pages/KakaoCallback';
import { Login } from './pages/Login';
import CommentList from './pages/movie/CommentList';
import { MoviePage } from './pages/movie/MoviePage';
import { Movies } from './pages/Movies';
import { MonthlyMovies } from './pages/mypage/MonthlyMovies';
import { Profile } from './pages/mypage/Profile';
import { Settings } from './pages/mypage/Settings';
import { News } from './pages/News';
import PeoplePage from './pages/PeoplePage';
import { Rating } from './pages/Rating';
import { Recommend } from './pages/Recommend';
import ReplyPage from './pages/replypage/ReplyPage';
import { Search } from './pages/Search';
import { Signup } from './pages/Signup';

export const App = () => {
  return (
    <div>
      <ReturnPathProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movies/:movieId" element={<MoviePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />\
            <Route path="/rating" element={<Rating />} />
            <Route path="/news" element={<News />} />
            <Route path="/profile/:view_user_id" element={<Profile />} />
            <Route
              path="/profile/:page_user_id/collections"
              element={<Collections />}
            />
            <Route
              path="/profile/:page_user_id/collections/new"
              element={<NewCollection />}
            />
            <Route path="/mypage/settings" element={<Settings />} />
            <Route path="/monthly/:date" element={<MonthlyMovies />} />
            <Route path="/movies/:movieId/comments" element={<CommentList />} />
            <Route path="/people/:peopleId" element={<PeoplePage />} />
            <Route
              path="/comments/:movieId/:commentId"
              element={<ReplyPage />}
            />
            <Route path="/search" element={<Search />} />
            <Route
              path="collections/:collectionId"
              element={<CollectionPage />}
            />
            <Route
              path="/collections/:collectionId/edit"
              element={<EditCollection />}
            />
            <Route path="/recommend" element={<Recommend />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/oauth/kakao" element={<KakaoCallback />} />
            <Route path="/oauth/google" element={<GoogleCallback />} />
          </Routes>
        </AuthProvider>
      </ReturnPathProvider>
    </div>
  );
};
