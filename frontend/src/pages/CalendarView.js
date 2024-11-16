import React, { useState, useEffect } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks
} from 'date-fns';
import axios from 'axios';
import MonthView from '../components/calendar/MonthView';
import WeekView from '../components/calendar/WeekView';

function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState({});
  const [viewMode, setViewMode] = useState('month');
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchEntries = async () => {
      const start = format(
        viewMode === 'month' 
          ? startOfMonth(currentDate)
          : startOfWeek(currentDate, { weekStartsOn: 0 }),
        'yyyy-MM-dd'
      );
      const end = format(
        viewMode === 'month'
          ? endOfMonth(currentDate)
          : endOfWeek(currentDate, { weekStartsOn: 0 }),
        'yyyy-MM-dd'
      );
      
      try {
        const response = await axios.get(`http://localhost:8000/entries/calendar/?start_date=${start}&end_date=${end}`);
        setEntries(response.data);
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };

    fetchEntries();
  }, [currentDate, viewMode]);

  const getDaysToRender = () => {
    if (viewMode === 'month') {
      return eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate)
      });
    } else {
      return eachDayOfInterval({
        start: startOfWeek(currentDate, { weekStartsOn: 0 }),
        end: endOfWeek(currentDate, { weekStartsOn: 0 })
      });
    }
  };

  const navigate = (direction) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else {
      if (direction === 1) {
        setCurrentDate(addWeeks(currentDate, 1));
        return;
      } else {
        setCurrentDate(subWeeks(currentDate, 1));
        return;
      }
    }
    setCurrentDate(newDate);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setCurrentDate(date);
    setViewMode('week');
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-4 sm:p-8 rounded-xl shadow-md min-h-[calc(100vh-6rem)]">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition duration-200"
          >
            ← Previous
          </button>
          
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">
            {format(currentDate, viewMode === 'month' ? 'MMMM yyyy' : "'Week of' MMM d")}
          </h2>
          
          <button 
            onClick={() => navigate(1)}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition duration-200"
          >
            Next →
          </button>
        </div>
        
        <select
          value={viewMode}
          onChange={(e) => {
            setViewMode(e.target.value);
            if (e.target.value === 'month') {
              setSelectedDate(null);
            }
          }}
          className="w-full sm:w-auto px-3 py-1 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="month">Month View</option>
          <option value="week">Week View</option>
        </select>
      </div>
      
      {viewMode === 'month' ? (
        <MonthView 
          days={getDaysToRender()} 
          entries={entries} 
          currentDate={currentDate}
          onDateClick={handleDateClick}
        />
      ) : (
        <WeekView 
          days={getDaysToRender()} 
          entries={entries}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
}

export default CalendarView;
