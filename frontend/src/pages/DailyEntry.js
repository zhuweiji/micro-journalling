import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';
const { REACT_APP_API_URL } = process.env;

function DailyEntry() {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${REACT_APP_API_URL}/entries/`, {
        content,
        mood
      });

      // Reset form
      setContent('');
      setMood('');

      // Show success toast and confetti
      toast.success('Journal entry saved! 📝', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#10B981',
          color: 'white',
          padding: '16px',
          borderRadius: '10px',
        },
        icon: '✨'
      });

      // Trigger confetti
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);

    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast.error('Failed to save journal entry', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#EF4444',
          color: 'white',
          padding: '16px',
          borderRadius: '10px',
        },
        icon: '❌'
      });
    }
  };

  return (
    <>
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.2}
        />
      )}
      <Toaster />
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Today's Journal Entry
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              What's on your mind today?
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              placeholder="Write your thoughts here..."
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="mood"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Today's Mood
            </label>
            <select
              id="mood"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Mood</option>
              <option value="happy">Happy 😊</option>
              <option value="neutral">Neutral 😐</option>
              <option value="sad">Sad 😢</option>
              <option value="excited">Excited 🎉</option>
              <option value="stressed">Stressed 😓</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-101 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Journal Entry
          </button>
        </form>
      </div>
    </>
  );
}

export default DailyEntry;
