import 'react-calendar/dist/Calendar.css';

import moment from 'moment';
import Calendar from 'react-calendar';
import { useNavigate } from 'react-router-dom';

//import testPoster from '../assets/test-poster.png';



const MovieCalendar = () => {
  const navigate = useNavigate();

  const handleDayClick = (date: Date) => {
    void navigate(`/monthly/${moment(date).format('DD')}`);
  }

  return (
    <div className="bg-white p-4 w-full justify-center relative flex flex-col">
      <h2 className="text-lg font-semibold mb-2">캘린더</h2>
      <Calendar
        formatDay={(locale, date) => moment(date).format("D")}
        formatMonthYear={(locale, date) => moment(date).format("YYYY.M")}
        calendarType="gregory"
        prev2Label={null}
        next2Label={null}
        showNeighboringMonth={false}
        minDetail='month'
        maxDetail='month'
        onClickDay={handleDayClick}
      />
    </div>
  );
};

export default MovieCalendar;
