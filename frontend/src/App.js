import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import DailyEntry from './pages/DailyEntry';
import CalendarView from './pages/CalendarView';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<DailyEntry />} />
            <Route path="/calendar" element={<CalendarView />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
