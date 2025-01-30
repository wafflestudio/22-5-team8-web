import 'react-calendar/dist/Calendar.css';

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
      { id: 1, title: 'Movie A', poster: 'https://placehold.co/20x20?text=MA' },
      { id: 2, title: 'Movie B', poster: 'https://placehold.co/20x20?text=MB' },
    ],
    '2025-01-23': [
      { id: 3, title: 'Movie C', poster: 'https://placehold.co/20x20?text=MC' },
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
      const dateKey = moment(date).format('YYYY-MM-DD');
      const movies = moviesWatchedByDate[dateKey];
      if (movies !== undefined && movies.length > 0) {
        return (
          <div className="flex justify-center mt-1">
            <img
              src={movies[0]?.poster}
              alt={`Poster`}
              className="w-10 h-15 object-cover"
            />
          </div>
        );
      } else {
        // For days without movies, show the numeric date
        return (
          <span style={{ display: 'inline-block', marginTop: '4px' }}>
            {moment(date).format('D')}
          </span>
        );
      }
    }
    return null;
  };

  return (
    <div className="bg-white p-4 w-full justify-center relative">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">캘린더</h2>
        <button
          onClick={handleCurrentMonth}
          className={`p-2 bg-white text-gray-400 rounded-md border-2
            ${!isCurrentMonth() ? 'border-black' : 'border-white'}`}
        >
          오늘
        </button>
      </div>

      <Calendar
        className="border-0 rounded-md"
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
        formatDay={() => ''}
        formatMonthYear={(_, date) => moment(date).format('YYYY.M')}
        calendarType="gregory"
        prev2Label={null}
        next2Label={null}
        showNeighboringMonth={false}
        minDetail="month"
        maxDetail="month"
        onClickDay={handleDayClick}
        tileContent={tileContent}
      />
    </div>
  );
};

export default MovieCalendar;
