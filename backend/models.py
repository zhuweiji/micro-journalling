from sqlalchemy import Column, Integer, String, Text, DateTime, func
from sqlalchemy.orm import Session
from datetime import datetime
import database
import schemas
from fastapi import HTTPException

class JournalEntry(database.Base):
    """
    SQLAlchemy model for journal entries
    """
    __tablename__ = "journal_entries"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    mood = Column(String, nullable=True)

def create_journal_entry(db: Session, entry: schemas.JournalEntryCreate):
    """
    Create a new journal entry in the database
    
    Args:
        db (Session): Database session
        entry (JournalEntryCreate): Entry details
    
    Returns:
        Created journal entry
    """
    db_entry = JournalEntry(
        content=entry.content,
        mood=entry.mood
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

def get_journal_entries(db: Session, skip: int = 0, limit: int = 10):
    """
    Retrieve journal entries with pagination
    
    Args:
        db (Session): Database session
        skip (int): Number of entries to skip
        limit (int): Maximum number of entries to return
    
    Returns:
        List of journal entries
    """
    total = db.query(func.count(JournalEntry.id)).scalar()
    entries = db.query(JournalEntry).order_by(
        JournalEntry.created_at.desc()
    ).offset(skip).limit(limit + 1).all()
    
    has_more = len(entries) > limit
    entries = entries[:limit]
    
    return {
        "items": entries,
        "total": total,
        "page": skip // limit + 1,
        "size": limit,
        "has_more": has_more
    }

def get_entries_by_date_range(db: Session, start_date: str, end_date: str):
    """
    Retrieve entries within a specific date range
    
    Args:
        db (Session): Database session
        start_date (str): Start date for entries
        end_date (str): End date for entries
    
    Returns:
        Dictionary of entries mapped to dates
    """
    # Parse the dates and set time to start/end of day
    start = datetime.fromisoformat(start_date).replace(hour=0, minute=0, second=0, microsecond=0)
    end = datetime.fromisoformat(end_date).replace(hour=23, minute=59, second=59, microsecond=999999)
    
    entries = db.query(JournalEntry).filter(
        JournalEntry.created_at.between(start, end)
    ).all()
    
    # Group entries by date
    entries_by_date = {}
    for entry in entries:
        date_key = entry.created_at.date().isoformat()
        if date_key not in entries_by_date:
            entries_by_date[date_key] = []
        entries_by_date[date_key].append(entry)
    
    return entries_by_date

def update_journal_entry(db: Session, entry_id: int, entry: schemas.JournalEntryCreate):
    """Update an existing journal entry"""
    db_entry = db.query(JournalEntry).filter(JournalEntry.id == entry_id).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    for key, value in entry.dict().items():
        setattr(db_entry, key, value)
    
    db.commit()
    db.refresh(db_entry)
    return db_entry

def delete_journal_entry(db: Session, entry_id: int):
    """Delete a journal entry"""
    db_entry = db.query(JournalEntry).filter(JournalEntry.id == entry_id).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    db.delete(db_entry)
    db.commit()
    return True
