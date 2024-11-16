import logging
from typing import List

import models
import schemas
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import database
from database import Base, engine

logging.basicConfig(level=logging.INFO)

log = logging.getLogger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Daily Journal App")

# CORS middleware to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", "https://journal.zhuhome.work",
        "https://www.journal.zhuhome.work"
    ],
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
def create_entry(entry: schemas.JournalEntryCreate,
                 db: Session = Depends(get_db)):
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
def read_entries(page: int = 1,
                 page_size: int = 10,
                 db: Session = Depends(get_db)):
    """
    Retrieve paginated journal entries
    
    Args:
        page (int): Page number
        page_size (int): Number of entries per page
        db (Session): Database session
    
    Returns:
        Paginated list of journal entries
    """
    return models.get_journal_entries(db,
                                      skip=(page - 1) * page_size,
                                      limit=page_size)


@app.get("/entries/calendar/")
def get_calendar_entries(start_date: str,
                         end_date: str,
                         db: Session = Depends(get_db)):
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


@app.put("/entries/{entry_id}", response_model=schemas.JournalEntry)
def update_entry(entry_id: int,
                 entry: schemas.JournalEntryCreate,
                 db: Session = Depends(get_db)):
    """
    Update a journal entry
    
    Args:
        entry_id (int): ID of the entry to update
        entry (JournalEntryCreate): Updated entry details
        db (Session): Database session
    
    Returns:
        Updated journal entry
    """
    return models.update_journal_entry(db, entry_id, entry)


@app.delete("/entries/{entry_id}")
def delete_entry(entry_id: int, db: Session = Depends(get_db)):
    """
    Delete a journal entry
    
    Args:
        entry_id (int): ID of the entry to delete
        db (Session): Database session
    
    Returns:
        Success message
    """
    log.info(f"Deleting entry with ID: {entry_id}")
    models.delete_journal_entry(db, entry_id)
    return {"message": "Entry deleted successfully"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
