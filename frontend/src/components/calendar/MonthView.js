import React from 'react';
import { format, isSameMonth } from 'date-fns';

function MonthView({ days, entries, currentDate }) {
  return (
    <div className="grid gap-2 grid-cols-7">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="text-center font-bold text-gray-600 pb-2">
          {day}
        </div>
      ))}
      
      {days.map(day => {
        const dateString = format(day, 'yyyy-MM-dd');
        const hasEntry = entries[dateString] && entries[dateString].length > 0;
        const isCurrentMonth = isSameMonth(day, currentDate);
        
        return (
          <div 
            key={dateString} 
            className={`
              p-3 border rounded-lg text-center relative
              ${hasEntry ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200'}
              ${isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}
              hover:bg-blue-100 transition duration-200
            `}
          >
            <div className="flex flex-col h-full">
              <div className="text-sm mb-1">
                {format(day, 'd')}
              </div>
              
              {hasEntry && (
                <div className="text-xs text-blue-700">
                  {entries[dateString].length} entry/entries
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MonthView;
