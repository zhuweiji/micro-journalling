import React from 'react';
import { format, isSameMonth } from 'date-fns';

function MonthView({ days, entries, currentDate, onDateClick }) {
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
            onClick={() => onDateClick(day)}
            className={`
              min-h-[4rem] sm:min-h-[5rem] p-2 border rounded-lg text-center relative
              ${hasEntry ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200'}
              ${isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}
              hover:bg-blue-100 transition duration-200
              cursor-pointer
              overflow-hidden
            `}
          >
            <div className="flex flex-col h-full">
              <div className="text-sm font-medium mb-1">
                {format(day, 'd')}
              </div>
              
              {hasEntry && (
                <div className="flex flex-col gap-0.5">
                  {entries[dateString].map((entry, index) => (
                    <div 
                      key={index} 
                      className={`
                        text-[0.65rem] sm:text-xs text-blue-700 
                        bg-white/50 rounded px-1 py-0.5
                        truncate
                        ${index >= 2 && 'hidden sm:block'}
                        ${index >= 3 && 'hidden'}
                      `}
                    >
                      {entry.content || entry.mood || 'Entry'}
                    </div>
                  ))}
                  {entries[dateString].length > 3 && (
                    <div className="text-[0.65rem] sm:text-xs text-blue-600 italic">
                      +{entries[dateString].length - 3} more
                    </div>
                  )}
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
