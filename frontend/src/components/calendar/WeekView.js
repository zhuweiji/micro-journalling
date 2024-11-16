import React from 'react';
import { format } from 'date-fns';

function WeekView({ days, entries }) {
  return (
    <div className="grid gap-2 grid-cols-1 sm:grid-cols-7">
      {days.map(day => {
        const dateString = format(day, 'yyyy-MM-dd');
        const hasEntry = entries[dateString] && entries[dateString].length > 0;
        
        return (
          <div 
            key={dateString} 
            className={`
              p-4 border rounded-lg
              ${hasEntry ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200'}
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
