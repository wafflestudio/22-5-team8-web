import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

//import calendar_img from '../assets/calendar_img.png';
import recommend_img from '../assets/recommend_img.png';
import taste_analysis_img from '../assets/taste_analysis_img.png';
import watchapedia_logo from '../assets/watchapedia.png';
import { useAuth } from '../components/AuthContext';
import { Footerbar } from '../components/Footerbar';
import { Headbar } from '../components/Headbar';
import { MovieScroller } from '../components/MovieScroller';
import NeedLoginPopup from './movie/NeedLoginPopup';

export const Index = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isLoading, setIsLoading] = useState({
    watcha10: true,
    watcha_buying: true,
    box_office: true,
    netflix: true,
  });

  const handleAnalysisClick = useCallback(() => {
    if (accessToken == null) {
      setShowLoginPopup(true);
    } else {
      void navigate('/analysis');
    }
  }, [accessToken, navigate]);

  const handleRecommendClick = useCallback(() => {
    if (accessToken == null) {
      setShowLoginPopup(true);
    } else {
      void navigate('/recommend');
    }
  }, [accessToken, navigate]);

  const handleLoadComplete = useCallback((type: string) => {
    setIsLoading((prev) => ({ ...prev, [type]: false }));
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative">
      {showLoginPopup && (
        <div className="fixed inset-0 z-50">
          <NeedLoginPopup
            isOpen={showLoginPopup}
            onClose={() => {
              setShowLoginPopup(false);
            }}
          />
        </div>
      )}
      <div className="flex-none fixed top-0 w-full z-10">
        <Headbar />
      </div>
      <div className="flex justify-center mt-20 mb-2">
        <img src={watchapedia_logo} alt="Watchapedia Logo" className="w-72" />
      </div>
      <div className="flex-1 text-left px-4 py-2 pb-16 pt-4">
        <div className="grid grid-cols-2 gap-4 my-4">
          {/*
          <div className="flex flex-col items-center">
            <img src={calendar_img} alt="Calendar" className="w-12 h-12 mb-1" />
            <h2 className="text-md">캘린더</h2>
          </div>
          */}
          <div
            className="flex flex-col items-center"
            onClick={handleAnalysisClick}
          >
            <img
              src={taste_analysis_img}
              alt="Taste Analysis"
              className="w-12 h-12 mb-1"
            />
            <h2 className="text-md">취향분석</h2>
          </div>
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={handleRecommendClick}
          >
            <img
              src={recommend_img}
              alt="Recommendations"
              className="w-12 h-12 mb-1"
            />
            <h2 className="text-md">추천</h2>
          </div>
        </div>
        <div className="mt-2 mb-2">
          <h1 className="text-xl font-bold">왓챠피디아 HOT 랭킹</h1>
          {isLoading.watcha10 && (
            <div className="h-[200px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
          <MovieScroller
            chart_type="watcha10"
            onLoadComplete={handleLoadComplete}
          />
        </div>

        <div className="mt-2 mb-2">
          <h1 className="text-xl font-bold">박스오피스 순위</h1>
          {isLoading.box_office && (
            <div className="h-[200px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
          <MovieScroller
            chart_type="box_office"
            onLoadComplete={handleLoadComplete}
          />
        </div>
      </div>
      <div className="flex-none fixed bottom-0 w-full z-10">
        <Footerbar />
      </div>
    </div>
  );
};

/*
MovieCalendar.tsx 구현하던 것
import 'react-calendar/dist/Calendar.css';
import 'moment/locale/ko';

import moment from 'moment';
import { useState } from 'react';
import Calendar from 'react-calendar';
import { useNavigate } from 'react-router-dom';

interface Movie {
  id: number;
  title: string;
  poster: string; // URL to poster image
}

const MovieCalendar = () => {
  const navigate = useNavigate();
  const [activeStartDate, setActiveStartDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const today = new Date();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const moviesWatchedByDate: Record<string, Movie[]> = {
    '2025-01-21': [
      {
        id: 1,
        title: 'Movie A',
        poster: 'https://placehold.co/120x160?text=MA',
      },
      {
        id: 2,
        title: 'Movie B',
        poster: 'https://placehold.co/120x160?text=MB',
      },
    ],
    '2025-01-23': [
      {
        id: 3,
        title: 'Movie C',
        poster: 'https://placehold.co/120x160?text=MC',
      },
    ],
  };

  const isCurrentMonth = () => {
    return (
      activeStartDate.getMonth() === todayMonth &&
      activeStartDate.getFullYear() === todayYear
    );
  };

  const handleDayClick = (clickedDate: Date) => {
    const dateKey = moment(clickedDate).format('YYYY-MM-DD');
    if ((moviesWatchedByDate[dateKey] ?? []).length > 0) {
      setSelectedDate(clickedDate);
      void navigate(`/monthly/${moment(clickedDate).format('DD')}`);
    }
  };

  const handleCurrentMonth = () => {
    setActiveStartDate(today);
    setSelectedDate(today);
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    // Show either the first movie poster or the day number
    if (view === 'month') {
      const isSameMonth =
        date.getMonth() === activeStartDate.getMonth() &&
        date.getFullYear() === activeStartDate.getFullYear();
      if (!isSameMonth) {
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <img
              src="https://placehold.co/120x160?text=AltMonth"
              alt="Neighboring Month"
              className="w-full h-full object-cover"
            />
          </div>
        );
      }

      const dateKey = moment(date).format('YYYY-MM-DD');
      const movies = moviesWatchedByDate[dateKey];
      if (movies !== undefined && movies.length > 0) {
        return (
          <div className="absolute inset-0">
            <img
              src={movies[0]?.poster}
              alt={`Poster`}
              className="w-full h-full object-cover"
            />
          </div>
        );
      } else {
        // For days without movies, show the numeric date
        return (
          <div className="absolute inset-0 flex items-center justify-center font-medium text-gray-400 text-lg">
            {moment(date).format('D')}
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="bg-white p-4 w-full mx-auto max-w-xl">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">캘린더</h2>
        <button
          onClick={handleCurrentMonth}
          className={`p-2 bg-white text-gray-400 rounded-md border-2
            ${!isCurrentMonth() ? 'border-gray-400' : 'border-white'}`}
        >
          오늘
        </button>
      </div>

      <Calendar
        locale="ko"
        className="react-calendar border-0 shadow-none"
        tileClassName={() =>
          'relative p-0 border-0 aspect-[2/3] overflow-hidden'
        }
        tileContent={tileContent}
        activeStartDate={activeStartDate}
        onActiveStartDateChange={({ activeStartDate: newStartDate }) => {
          if (newStartDate !== null) {
            setActiveStartDate(newStartDate);
          }
        }}
        view="month"
        value={selectedDate}
        onChange={(date) => {
          setSelectedDate(date as Date);
        }}
        prevLabel={
          <span className="text-4xl font-bold text-gray-300 px-2">‹</span>
        }
        nextLabel={
          <span className="text-4xl font-bold text-gray-300 px-2">›</span>
        }
        navigationLabel={({ date }) => (
          <span className="text-lg font-bold mx-0 px-0">
            {moment(date).format('YYYY.M')}
          </span>
        )}
        formatDay={() => ''}
        formatMonthYear={(_, date) => moment(date).format('YYYY.M')}
        formatShortWeekday={(_, date) => {
          const formatted = moment(date).locale('ko').format('dd')[0];
          if (formatted === undefined) return '';
          return formatted;
        }}
        calendarType="gregory"
        prev2Label={null}
        next2Label={null}
        minDetail="month"
        maxDetail="month"
        onClickDay={handleDayClick}
      />
    </div>
  );
};

export default MovieCalendar;
*/
