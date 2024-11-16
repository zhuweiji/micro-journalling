import React, { useState } from 'react';
import axios from 'axios';

function DailyEntry() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/entries/', {
        title,
        content,
        mood
      });
      
      // Reset form after successful submission
      setTitle('');
      setContent('');
      setMood('');
      
      alert('Journal entry saved successfully!');
    } catch (error) {
      console.error('Error saving journal entry:', error);
      alert('Failed to save journal entry');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Today's Journal Entry
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label 
            htmlFor="title" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Entry Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's on your mind?"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label 
            htmlFor="content" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Journal Entry
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
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
  );
}

export default DailyEntry;
