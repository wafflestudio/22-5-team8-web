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
  reviews_count: number;
};

export type Review = {
  id: number;
  user_id: number;
  user_name: string;
  profile_url: string | null;
  movie_id: number;
  movie: Movie;
  content: string;
  rating: number | null;
  likes_count: number;
  created_at: string;
  spoiler: boolean;
  status: '' | 'WatchList' | 'Watching';
  like: boolean;
  comments_count: number;
};

export type Reply = {
  id: number;
  user_id: number;
  user_name: string;
  profile_url: string | null;
  review_id: number;
  content: string;
  likes_count: number;
  created_at: string;
  like: boolean;
};

export type CollectionComment = {
  id: number;
  user_id: number;
  user_name: string;
  profile_url: string | null;
  collection_id: number;
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

export type SearchResultRaw = {
  movie_list: Array<number>;
  user_list: Array<number>;
  participant_list: Array<number>;
  collection_list: Array<number>;
  movie_dict_by_genre: Record<string, number[]>;
};

export type SearchResult = {
  movies: Movie[];
  users: UserProfile[];
  people: People[];
  collections: Collection[];
  genres: Record<string, Movie[]>;
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

export type SearchCategory =
  | 'movie'
  | 'genre'
  | 'person'
  | 'collection'
  | 'user';

export type Recommendation = {
  movie_id: number;
  movie: Movie;
  expected_rating: number;
};
export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  user_id: number;
};

export type RatingDistribution = {
  [key: string]: number;
};

export type UserAnalysisRating = {
  id: number; // 분석 ID
  user_id: number; // 사용자 ID
  rating_num: number; // 평가 개수
  rating_avg: number; // 평균 평점
  rating_dist: RatingDistribution; // 평점 분포
  rating_mode: number; // 가장 많이 나온 평점
  rating_message: string; // 평점 관련 메시지
  viewing_time: number; // 총 시청 시간
  viewing_message: string; // 시청 시간 관련 메시지
};

export type Dictionary = {
  [key: string]: [number, number]; // [비율, 개수]
};

export type UserAnalysisPreference = {
  id: number; // 분석 ID
  user_id: number; // 사용자 ID
  actor_dict: Dictionary; // 배우 관련 딕셔너리
  director_dict: Dictionary; // 감독 관련 딕셔너리
  country_dict: Dictionary; // 국가 관련 딕셔너리
  genre_dict: Dictionary; // 장르 관련 딕셔너리
};

export type FollowUser = {
  id: number;
  username: string;
  login_id: string;
  profile_url: string | null;
};
