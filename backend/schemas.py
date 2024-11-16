from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class JournalEntryBase(BaseModel):
    """
    Base schema for journal entries
    """
    title: str
    content: str
    mood: Optional[str] = None

class JournalEntryCreate(JournalEntryBase):
    """
    Schema for creating a new journal entry
    """
    pass

class JournalEntry(JournalEntryBase):
    """
    Schema for returning a journal entry from the database
    """
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
