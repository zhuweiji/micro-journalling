import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, parseISO } from 'date-fns';
import axios from 'axios';

function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [entries, setEntries] = useState({});

  useEffect(() => {
    const fetchEntries = async () => {
      const start = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
      const end = format(endOfMonth(currentMonth), 'yyyy-MM-dd');
      
      try {
        const response = await axios.get(`http://localhost:8000/entries/calendar/?start_date=${start}&end_date=${end}`);
        setEntries(response.data);
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };

    fetchEntries();
  }, [currentMonth]);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const renderCalendar = () => {
    return (
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-bold text-gray-600">{day}</div>
        ))}
        
        {daysInMonth.map(day => {
          const dateString = format(day, 'yyyy-MM-dd');
          const hasEntry = entries[dateString] && entries[dateString].length > 0;
          
          return (
            <div 
              key={dateString} 
              className={`
                p-2 border rounded-md text-center 
                ${hasEntry ? 'bg-blue-100 border-blue-300' : 'bg-gray-100 border-gray-300'}
                hover:bg-blue-200 transition duration-200
              `}
            >
              <span className="text-sm">{format(day, 'd')}</span>
              {hasEntry && (
                <div className="text-xs text-blue-700 mt-1">
                  {entries[dateString].length} entry/entries
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const changeMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => changeMonth(-1)}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Previous
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        
        <button 
          onClick={() => changeMonth(1)}
          className="text-gray-600 hover:text-gray-900"
        >
          Next →
        </button>
      </div>
      
      {renderCalendar()}
    </div>
  );
}

export default CalendarView;
