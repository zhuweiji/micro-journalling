from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import models
import schemas
import database
from database import Base, engine

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Daily Journal App")

# CORS middleware to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get database session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/entries/", response_model=schemas.JournalEntry)
def create_entry(entry: schemas.JournalEntryCreate, db: Session = Depends(get_db)):
    """
    Create a new journal entry
    
    Args:
        entry (JournalEntryCreate): Details of the journal entry
        db (Session): Database session
    
    Returns:
        Created journal entry
    """
    return models.create_journal_entry(db, entry)

@app.get("/entries/", response_model=schemas.PaginatedJournalEntries)
def read_entries(
    page: int = 1,
    page_size: int = 10,
    db: Session = Depends(get_db)
):
    """
    Retrieve journal entries with pagination
    """
    skip = (page - 1) * page_size
    return models.get_journal_entries(db, skip=skip, limit=page_size)

@app.get("/entries/calendar/")
def get_calendar_entries(
    start_date: str, 
    end_date: str, 
    db: Session = Depends(get_db)
):
    """
    Retrieve entries for a specific date range (calendar view)
    
    Args:
        start_date (str): Start date for entries
        end_date (str): End date for entries
        db (Session): Database session
    
    Returns:
        Dictionary of entries mapped to dates
    """
    return models.get_entries_by_date_range(db, start_date, end_date)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
