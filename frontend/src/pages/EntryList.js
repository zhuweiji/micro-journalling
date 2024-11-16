import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const MoodEmoji = ({ mood }) => {
  const emojis = {
    happy: '😊',
    neutral: '😐',
    sad: '😢',
    excited: '🎉',
    stressed: '😓'
  };
  return mood ? emojis[mood] || mood : null;
};

function EntryList() {
  const [entries, setEntries] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const pageSize = 5;

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/entries/?page=${page}&page_size=${pageSize}`);
      setEntries(response.data.items);
      setTotal(response.data.total);
      setHasMore(response.data.has_more);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [page]);

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      setPage(page + 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Journal Entries
      </h1>
      
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {entries.map((entry) => (
              <div 
                key={entry.id}
                className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="text-sm text-gray-600">
                    {format(new Date(entry.created_at), 'MMMM d, yyyy - h:mm a')}
                  </div>
                  {entry.mood && (
                    <div className="text-2xl" title={`Mood: ${entry.mood}`}>
                      <MoodEmoji mood={entry.mood} />
                    </div>
                  )}
                </div>
                <div className="prose max-w-none">
                  {entry.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-800 mb-2">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className={`px-4 py-2 rounded-md ${
                page === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Previous
            </button>
            
            <div className="text-sm text-gray-600">
              Page {page} • {total} total entries
            </div>
            
            <button
              onClick={handleNextPage}
              disabled={!hasMore}
              className={`px-4 py-2 rounded-md ${
                !hasMore
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default EntryList;
