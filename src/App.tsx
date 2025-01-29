import './index.css';

import { Route, Routes } from 'react-router-dom';

import { AuthProvider } from './components/AuthContext';
import { ReturnPathProvider } from './components/ReturnPathContext';
import CollectionPage from './pages/collection/CollectionPage';
import { Collections } from './pages/collection/Collections';
import { EditCollection } from './pages/collection/EditCollection';
import { NewCollection } from './pages/collection/NewCollection';
import { Index } from './pages/Index';
import { Login } from './pages/Login';
import CommentList from './pages/movie/CommentList';
import { MoviePage } from './pages/movie/MoviePage';
import { Movies } from './pages/Movies';
import { MyPage } from './pages/mypage/MyPage';
import { Profile } from './pages/mypage/Profile';
import { Settings } from './pages/mypage/Settings';
import { News } from './pages/News';
import PeoplePage from './pages/PeoplePage';
import { Rating } from './pages/Rating';
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
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/mypage/settings" element={<Settings />} />
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
          </Routes>
        </AuthProvider>
      </ReturnPathProvider>
    </div>
  );
};
