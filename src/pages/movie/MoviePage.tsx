import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useAuth } from '../../components/AuthContext';
import CommnetFragment from '../../components/CommentFragment';
import { Footerbar } from '../../components/Footerbar';
import { fetchUserReviews } from '../../utils/Functions';
import type { Movie, Review } from '../../utils/Types';
import ButtonBar from './ButtonBar';
import CastList from './CastList';
import CommentPopup from './CommentPopup';
import { Header } from './Header';
import StarRating from './StarRating';

export const MoviePage = () => {
  const { movieId } = useParams();
  const id: number = parseInt(movieId == null ? '0' : movieId);
  const { accessToken } = useAuth();

  // test cast data
  /*
  const castData: Participant[] = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    name: `Actor ${i + 1}`,
    role: i > 5 ? '' : `Role ${i + 1}`,
    profile_url: `https://picsum.photos/200/300?random=${Math.random()}`,
  }));

  const testData: Movie = {
    id: id,
    title: '파이트 클럽',
    original_title: 'Fight Club',
    year: 1999,
    genres: ['드라마', '액션'],
    countries: ['미국', '독일', '이탈리아'],
    synopsis: `당신이 알고 있는 모든 것은 허구다!

비싼 가구들로 집 안을 채우지만 삶에 강한 공허함을 느끼는 자동차 리콜 심사관 ‘잭’. 거부할 수 없는 매력의 거친 남자 ‘테일러 더든’과의 우연한 만남으로 본능이 이끄는 대로 삶을 살기로 결심한다. 어느 날, “싸워봐야 네 자신을 알게 된다”라는 테일러 더든의 말에 통쾌한 한 방을 날리는 잭. 두 사람은 여태껏 경험해보지 못한 강렬한 카타르시스를 느끼며 ‘파이트 클럽’이라는 비밀 조직을 결성하고, 폭력으로 세상에 저항하는 거대한 집단이 형성된다. 하지만, 걷잡을 수 없이 커진 ‘파이트 클럽’은 시간이 지날수록 의미가 변질되고, 잭과 테일러 더든 사이의 갈등도 점차 깊어져 가는데…

거침없는 진짜 남자들의 진짜 싸움이 시작된다!`,
    average_rating: 4.1,
    ratings_count: 123456,
    running_time: 139,
    grade: '청불',
    poster_url: `https://an2-img.amz.wtchn.net/image/v2/GBRSGHdS2M-RVVoTrHcvnw.jpg?jwt=ZXlKaGJHY2lPaUpJVXpJMU5pSjkuZXlKdmNIUnpJanBiSW1SZk5Ea3dlRGN3TUhFNE1DSmRMQ0p3SWpvaUwzWXhMMjlxZFd0aE4zSmpZemwxZWpkellXWmhaVzl3SW4wLjlxSHZfZjRNVGZyMTVJTFR2S2loRWJmXzk5ZFE2TEc4WFVHS2FiTzhwdEU`,
    backdrop_url: `https://an2-img.amz.wtchn.net/image/v2/0CixI1Hp5q2TixrjBXqeOg.jpg?jwt=ZXlKaGJHY2lPaUpJVXpJMU5pSjkuZXlKdmNIUnpJanBiSW1SZk1Ua3lNSGd4TURnd2NUZ3dJbDBzSW5BaU9pSXZkakV2YlRONlpqWnBaREoyYUdJemNtZDBabTFuYUdjaWZRLkdIUVJ1WWZGYWRrNmFUUTVCMWwxZDBUcTZqUG12Zi1udXdsbmFGNzYyTms`,
    participants: castData,
  };
  */

  const [movieData, setMovieData] = useState<Movie | null>(null);
  const [reviewList, setReviewList] = useState<Review[] | null>(null);
  const [validContentReviewList, setValidContentReviewList] = useState<
    Review[] | null
  >(null);
  const [firstReview, setFirstReview] = useState<Review | null>(null);
  const [myReview, setMyReview] = useState<Review | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(false);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setIsLoaded(false);
        const [movieResponse, reviewResponse] = await Promise.all([
          fetch(`/api/movies/${id}`),
          fetch(`/api/reviews/movie/${id}`),
        ]);
        if (!movieResponse.ok) {
          throw new Error('Failed to fetch movie data');
        }
        const data = (await movieResponse.json()) as Movie;
        setMovieData(data);
        //console.log(data);

        if (!reviewResponse.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const reviewData = (await reviewResponse.json()) as Review[];
        const validContentReviewData = reviewData.filter(
          (review) => review.content !== '',
        );

        setReviewList(reviewData);
        setValidContentReviewList(validContentReviewData);

        const firstReviewData = validContentReviewData.find(
          (review) => review.content !== '',
        );
        setFirstReview(firstReviewData === undefined ? null : firstReviewData);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoaded(true);
      }
    };

    void fetchMovieData();
    // setMovieData(testData);

    if (accessToken !== null) {
      fetchUserReviews(accessToken)
        .then((data) => {
          if (data === null) {
            setMyReview(null);
          } else {
            const myReviewData = data.find((review) => review.movie_id === id);
            setMyReview(myReviewData === undefined ? null : myReviewData);
            //console.log(myReviewData);
          }
        })
        .catch((err: unknown) => {
          console.error(err);
        });
    }
  }, [accessToken, id]);

  if (movieData == null || !isLoaded) {
    console.debug(reviewList);
    return (
      <div className="flex flex-col min-h-screen relative">
        <div className="flex-none fixed z-10 top-0 w-full">
          <Header title="Loading..." />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </div>
        <div className="flex-none fixed z-10 bottom-0 w-full">
          <Footerbar />
        </div>
      </div>
    );
  }

  const handleMyReviewUpdate = (updatedReview: Review | null) => {
    setMyReview(updatedReview);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen relative">
        <div className="flex-none drop-shadow fixed z-10 top-0 w-full">
          <Header title={movieData.title} />
        </div>
        <div className="flex-1 flex flex-col items-center justify-start py-16">
          <div className="relative w-full h-[550px] mb-3">
            <img
              src={movieData.backdrop_url}
              alt={movieData.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
              <p className="text-4xl font-semibold">{movieData.title}</p>
              <p className="text-sm mt-6">{movieData.original_title}</p>
              <p className="text-sm mt-2">
                {movieData.year} · {movieData.genres.join('/')} ·{' '}
                {movieData.countries.join(', ')}
              </p>
              <p className="text-sm my-2">
                {Math.floor(movieData.running_time / 60)}시간{' '}
                {movieData.running_time % 60}분 · {movieData.grade}
              </p>
            </div>
          </div>
          <StarRating
            movieId={id}
            myReview={myReview}
            onReviewUpdate={handleMyReviewUpdate}
          />
          <hr className="w-11/12 my-3 bg-gray-300" />
          <div className="flex w-11/12 justify-center items-center my-2">
            <div className="text-sm text-gray-500 whitespace-pre-line text-center">
              평균 별점
              <br />({movieData.ratings_count}명)
            </div>
            <div className="ml-4 mr-4 text-4xl font-bold text-gray-700">
              {movieData.average_rating === null
                ? '-'
                : movieData.average_rating.toFixed(1)}
            </div>
          </div>
          <hr className="w-11/12 my-3 bg-gray-300" />
          <ButtonBar
            movie={movieData}
            myReview={myReview}
            onReviewUpdate={handleMyReviewUpdate}
          />
          <hr className="w-11/12 my-3 bg-gray-300" />
          {(() => {
            if (myReview === null) return null;
            else if (myReview.content !== '')
              return (
                <>
                  <div className="flex flex-col justify-start w-11/12">
                    <h2 className="px-4 py-2 text-xs text-gray-600">
                      내가 쓴 코멘트
                    </h2>
                    <CommnetFragment
                      initialReview={myReview}
                      viewMode="myComment"
                      openPopup={() => {
                        setIsCommentPopupOpen(true);
                      }}
                    />
                  </div>
                  <hr className="w-11/12 bg-gray-300 my-3" />
                </>
              );
            else if (myReview.rating !== 0)
              return (
                <>
                  <div className="bg-gray-100 rounded flex flex-col text-center item-center justify-start w-11/12">
                    <div className="text-gray-600 p-4">
                      이 작품에 대한 평가를 글로 남겨보세요.
                    </div>
                    <button
                      onClick={() => {
                        setIsCommentPopupOpen(true);
                      }}
                      className="text-hotPink px-4 pb-4"
                    >
                      코멘트 남기기
                    </button>
                  </div>
                  <hr className="w-11/12 bg-gray-300 my-3" />
                </>
              );
            else return null;
          })()}
          <div className="w-11/12 my-3 text-gray-700 text-sm whitespace-pre-line">
            {movieData.synopsis.replace(/\\n/g, '\n')}
          </div>
          <div className="flex w-9/12 my-5 justify-center">
            <img src={movieData.poster_url} alt={movieData.title} />
          </div>
          <hr className="w-11/12 my-5 bg-gray-300" />
          <div className="w-11/12 overflow-hidden">
            <CastList participants={movieData.participants} />
          </div>
          <hr className="w-11/12 my-5 bg-gray-300" />
          <div className="flex flex-col justify-start w-11/12 mb-10">
            <div className="flex items-center px-4">
              <h2 className="text-lg font-semibold">코멘트</h2>
              <h2 className="ml-2 text-hotPink">
                {validContentReviewList === null
                  ? 0
                  : validContentReviewList.length}
              </h2>
              <Link
                to={`/movies/${id}/comments`}
                className="ml-auto text-hotPink"
              >
                더보기
              </Link>
            </div>
            <CommnetFragment initialReview={firstReview} viewMode="moviePage" />
          </div>
        </div>
        <div className="flex-none fixed z-10 bottom-0 w-full">
          <Footerbar />
        </div>
      </div>
      <CommentPopup
        isOpen={isCommentPopupOpen}
        onClose={() => {
          setIsCommentPopupOpen(false);
        }}
        movie={movieData}
        myReview={myReview}
        onReviewUpdate={handleMyReviewUpdate}
      />
    </>
  );
};
