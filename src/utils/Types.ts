export type Participant = {
  id: number;
  name: string;
  role: string;
  profile_url: string | null;
};

export type Movie = {
  id: number;
  title: string;
  original_title: string;
  year: number;
  genres: string[];
  countries: string[];
  synopsis: string;
  average_rating: number | null;
  ratings_count: number;
  running_time: number;
  grade: string;
  poster_url: string;
  backdrop_url: string;
  participants: Participant[];
};

export type Review = {
  id: number;
  user_id: number;
  user_name: string;
  movie_id: number;
  content: string;
  rating: number;
  likes_count: number;
  created_at: string;
};

export type Reply = {
  id: number;
  user_id: number;
  user_name: string;
  review_id: number;
  content: string;
  likes_count: number;
  created_at: string;
};

export type People = {
  id: number;
  name: string;
  profile_url: string | null;
  roles: string[];
  biography: string;
};

export type PeopleMovieCredit = {
  id: number;
  title: string;
  year: number;
  average_rating: number | null;
  poster_url: string;
  cast: string;
};

export type PeopleMovieCreditResponse = {
  role: string;
  movies: PeopleMovieCredit[];
};

export type SearchResult = {
  movie_list: Array<number>;
  user_list: Array<number>;
  participant_list: Array<number>;
  collection_list: Array<number>;
};

export type Collection = {
  id: number;
  user_id: number;
  title: string;
  overview: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  movies: Movie[];
};

export type UserProfile = {
  username: string;
  user_id: number;
  login_id: string;
  profile_url: string | null;
  status_message: string | null;
  following_count: number;
  follower_count: number;
  review_count: number;
  comment_count: number;
  collection_count: number;
};

export type SearchCategory = 'movie' | 'person' | 'collection' | 'user';
