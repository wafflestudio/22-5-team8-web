export type Participant = {
  id: number;
  name: string;
  role: string;
  profile_url: string;
}

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
}