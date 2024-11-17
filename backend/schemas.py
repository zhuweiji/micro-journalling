from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Union

class JournalEntryBase(BaseModel):
    """
    Base schema for journal entries
    """
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

class PaginatedJournalEntries(BaseModel):
    """
    Schema for paginated journal entries response
    """
    items: List[JournalEntry]
    total: int
    page: int
    size: int
    has_more: bool

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Union[str, None] = None

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        orm_mode = True
