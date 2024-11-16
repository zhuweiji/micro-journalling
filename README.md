# Daily Journal App

A modern, minimalist journaling application designed to help you capture your daily thoughts, track your moods, and reflect on your experiences. This application provides an intuitive interface for maintaining a digital journal with powerful organization and viewing capabilities.

## Why Journalling?

- **Focus**: Journalling is a great way to focus on your thoughts and get things off your chest
- **Reflection**: It's a great way to reflect on your day and learn from your experiences
- **Mood Tracking**: It's a great way to track your moods and identify patterns in your life
- **Self-Awareness**: It's a great way to become more aware of your thoughts and feelings
- **Personal Growth**: It's a great way to develop self-awareness and make positive changes in your life.

## Features

### Core Functionality
- **Daily Journaling**: Write and save your thoughts with a clean, distraction-free interface
- **Mood Tracking**: Record your mood with each entry using expressive emojis (😊 😐 😢 🎉 😓)
- **Rich Text Support**: Write entries with paragraph formatting and natural line breaks
- **Instant Saving**: Entries are saved immediately with delightful visual feedback

### Calendar Integration
- **Monthly Overview**: View all your entries in a calendar layout
- **Weekly View**: Detailed weekly view for focused reflection
- **Entry Preview**: Quick previews of entries directly in the calendar
- **Date Navigation**: Easily switch between dates and view modes

### Entry Management
- **Chronological List**: Browse all entries in a paginated list view
- **Edit Capabilities**: Update or modify previous entries inline
- **Delete Options**: Remove entries with confirmation
- **Search & Filter**: Find entries by date range (more filtering coming soon)

### User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Visual Feedback**: Delightful animations and notifications for actions
- **Clean Interface**: Minimalist design focused on content
- **Intuitive Navigation**: Easy-to-use navigation between different views

### Technical Features
- **Fast Performance**: Built with modern web technologies
- **Data Persistence**: Reliable SQLite database storage
- **API Documentation**: Full OpenAPI/Swagger documentation
- **Docker Support**: Easy deployment with containerization

## Tech Stack
- Frontend: React
- Backend: Python (FastAPI)
- Database: SQLite
- Styling: Tailwind CSS

## Running with Docker (Recommended)
The easiest way to run the application is using Docker:

1. Make sure you have [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/) installed
2. Clone the repository
3. Navigate to the project root directory
4. Run the application:
   ```bash
   docker-compose up --build
   ```
5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Manual Setup (Development)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a Python virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install fastapi>=0.115.5 pydantic>=2.9.2 sqlalchemy>=2.0.36 uvicorn>=0.32.0
   ```
4. Run the backend server:
   ```bash
   python main.py
   ```
   The API will be available at http://localhost:8000

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   The application will be available at http://localhost:3000

## Development Notes
- The backend uses SQLite as the database, which is stored in `backend/journal.db`
- When running with Docker, the database file is persisted using a volume mount
- API documentation is available at http://localhost:8000/docs when the backend is running

## Future Enhancements
- LLM-powered entry summaries and insights
- Advanced mood tracking and visualization
- Rich text formatting with markdown support
- Tags and categories for better organization
- Full-text search capabilities
- Export options (PDF, Markdown, Plain Text)
- Multiple journal support
- Custom themes and styling options
- Offline support with PWA
- Backup and sync features
- Privacy-focused sharing options
- Integration with external calendars
