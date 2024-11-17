import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import toast, { Toaster } from 'react-hot-toast';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { api } from '../context/AuthContext';

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
  const [editingEntry, setEditingEntry] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const pageSize = 5;

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/entries/?page=${page}&page_size=${pageSize}`);
      console.log(response.data)
      setEntries(response.data.items);
      setTotal(response.data.total);
      setHasMore(response.data.has_more);
    } catch (error) {
      console.error('Error fetching entries:', error);
      toast.error('Failed to load entries');
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

  const handleEdit = (entry) => {
    setEditingEntry({ ...entry });
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/entries/${editingEntry.id}`, {
        content: editingEntry.content,
        mood: editingEntry.mood
      });

      setEntries(entries.map(entry =>
        entry.id === editingEntry.id ? editingEntry : entry
      ));

      setEditingEntry(null);
      toast.success('Entry updated successfully! ✏️');
    } catch (error) {
      console.error('Error updating entry:', error);
      toast.error('Failed to update entry');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await api.delete(`/entries/${id}`);
        setEntries(entries.filter(entry => entry.id !== id));
        toast.success('Entry deleted successfully! 🗑️');
      } catch (error) {
        console.error('Error deleting entry:', error);
        toast.error('Failed to delete entry');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
      <Toaster />
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
                className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-200 relative"
              >
                {editingEntry?.id === entry.id ? (
                  <div className="space-y-4">
                    <textarea
                      value={editingEntry.content}
                      onChange={(e) => setEditingEntry({ ...editingEntry, content: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px]"
                      rows={10}
                    />
                    <select
                      value={editingEntry.mood}
                      onChange={(e) => setEditingEntry({ ...editingEntry, mood: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="happy">Happy 😊</option>
                      <option value="neutral">Neutral 😐</option>
                      <option value="sad">Sad 😢</option>
                      <option value="excited">Excited 🎉</option>
                      <option value="stressed">Stressed 😓</option>
                    </select>
                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        onClick={() => setEditingEntry(null)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdate}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
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
                    <div className="prose max-w-none mb-14">
                      {entry.content.split('\n').map((paragraph, index) => (
                        <p key={index} className="text-gray-800 mb-2">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    <div className="absolute bottom-4 right-4 flex space-x-2">
                      <button
                        onClick={() => handleEdit(entry)}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-1.5 rounded-md hover:bg-gray-100"
                        title="Edit entry"
                      >
                        <FaEdit size={14} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-1.5 rounded-md hover:bg-gray-100"
                        title="Delete entry"
                      >
                        <FaTrash size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className={`px-4 py-2 rounded-md ${page === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {page} {total > 0 && `of ${Math.ceil(total / pageSize)}`}
            </span>
            <button
              onClick={handleNextPage}
              disabled={!hasMore}
              className={`px-4 py-2 rounded-md ${!hasMore
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
