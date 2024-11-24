from sqlalchemy import Column, Integer, String, Text, DateTime, func, Boolean
from sqlalchemy.orm import Session
from datetime import datetime
import database
import schemas
from fastapi import HTTPException
from utils import to_local_time, to_utc

class JournalEntry(database.Base):
    """
    SQLAlchemy model for journal entries
    """
    __tablename__ = "journal_entries"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    mood = Column(String, nullable=True)

    def to_dict(self):
        """Convert entry to dictionary with localized time"""
        return {
            "id": self.id,
            "content": self.content,
            "created_at": to_local_time(self.created_at),
            "mood": self.mood
        }

class User(database.Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

def create_journal_entry(db: Session, entry: schemas.JournalEntryCreate):
    """
    Create a new journal entry in the database
    
    Args:
        db (Session): Database session
        entry (JournalEntryCreate): Entry details
    
    Returns:
        Created journal entry
    """
    created_at = entry.created_at if entry.created_at else datetime.utcnow()
    if created_at.tzinfo is not None:
        created_at = to_utc(created_at)
    
    db_entry = JournalEntry(
        content=entry.content,
        mood=entry.mood,
        created_at=created_at
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry.to_dict()

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
    
    # Convert entries to dict with localized time
    entries_dict = [entry.to_dict() for entry in entries]
    
    return {
        "items": entries_dict,
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
        start_date (str): Start date for entries (in local time)
        end_date (str): End date for entries (in local time)
    
    Returns:
        Dictionary of entries mapped to dates
    """
    # Parse the dates and set time to start/end of day in local time
    start = datetime.fromisoformat(start_date).replace(hour=0, minute=0, second=0, microsecond=0)
    end = datetime.fromisoformat(end_date).replace(hour=23, minute=59, second=59, microsecond=999999)
    
    # Convert to UTC for database query
    start_utc = to_utc(start)
    end_utc = to_utc(end)
    
    entries = db.query(JournalEntry).filter(
        JournalEntry.created_at.between(start_utc, end_utc)
    ).all()
    
    # Group entries by date (in local time)
    entries_by_date = {}
    for entry in entries:
        local_date = to_local_time(entry.created_at)
        date_key = local_date.date().isoformat()
        if date_key not in entries_by_date:
            entries_by_date[date_key] = []
        entries_by_date[date_key].append(entry.to_dict())
    
    return entries_by_date

def update_journal_entry(db: Session, entry_id: int, entry: schemas.JournalEntryCreate):
    """
    Update an existing journal entry
    
    Args:
        db (Session): Database session
        entry_id (int): ID of entry to update
        entry (JournalEntryCreate): Updated entry details
    
    Returns:
        Updated journal entry
    """
    db_entry = db.query(JournalEntry).filter(JournalEntry.id == entry_id).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    db_entry.content = entry.content
    db_entry.mood = entry.mood
    if entry.created_at:
        db_entry.created_at = to_utc(entry.created_at)
    
    db.commit()
    db.refresh(db_entry)
    return db_entry.to_dict()

def delete_journal_entry(db: Session, entry_id: int):
    """Delete a journal entry"""
    db_entry = db.query(JournalEntry).filter(JournalEntry.id == entry_id).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    db.delete(db_entry)
    db.commit()
    return True
