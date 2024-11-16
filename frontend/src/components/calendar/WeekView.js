import React, { useEffect, useRef } from 'react';
import { format, isSameDay } from 'date-fns';

function WeekView({ days, entries, selectedDate }) {
  const selectedDayRef = useRef(null);

  useEffect(() => {
    if (selectedDate && selectedDayRef.current) {
      selectedDayRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [selectedDate]);

  return (
    <div className="grid gap-2 grid-cols-1 sm:grid-cols-7">
      {days.map(day => {
        const dateString = format(day, 'yyyy-MM-dd');
        const hasEntry = entries[dateString] && entries[dateString].length > 0;
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        
        return (
          <div 
            key={dateString}
            ref={isSelected ? selectedDayRef : null}
            className={`
              p-4 border rounded-lg
              ${hasEntry ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200'}
              ${isSelected ? 'ring-2 ring-blue-500' : ''}
              hover:bg-blue-100 transition duration-200
            `}
          >
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-800">
                  {format(day, 'EEEE')}
                </span>
                <span className="text-gray-600">
                  {format(day, 'MMM d')}
                </span>
              </div>
              
              {hasEntry ? (
                <div className="space-y-2">
                  {entries[dateString].map((entry, index) => (
                    <div 
                      key={index}
                      className="bg-white p-3 rounded-md border border-blue-200 shadow-sm"
                    >
                      <p className="text-sm text-gray-800 line-clamp-3">
                        {entry.content}
                      </p>
                      {entry.mood && (
                        <div className="mt-2 text-sm text-gray-600">
                          Mood: {entry.mood}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic">
                  No entries
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default WeekView;
