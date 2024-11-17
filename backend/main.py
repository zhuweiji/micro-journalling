import logging
from typing import List

import models
import schemas
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from database import Base, engine, SessionLocal
from auth import (
    get_db,
    create_access_token,
    get_current_user,
    verify_password,
    create_default_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

logging.basicConfig(level=logging.INFO)

log = logging.getLogger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Daily Journal App")

# CORS middleware to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:11302",
        "http://localhost:3000",
        "https://journal.zhuhome.work",
        "https://www.journal.zhuhome.work",
        "https://myjournal.zhuhome.work",
        "https://www.myjournal.zhuhome.work",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Create default user on startup
@app.on_event("startup")
async def startup_event():
    db = SessionLocal()
    create_default_user(db)
    db.close()

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user


# Protect journal routes with authentication
@app.post("/entries/", response_model=schemas.JournalEntry)
def create_entry(
    entry: schemas.JournalEntryCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return models.create_journal_entry(db=db, entry=entry)


@app.get("/entries/", response_model=schemas.PaginatedJournalEntries)
def read_entries(
    page: int = 1,
    page_size: int = 10,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return models.get_journal_entries(db, skip=(page - 1) * page_size, limit=page_size)


@app.get("/entries/calendar/")
def get_calendar_entries(
    start_date: str,
    end_date: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return models.get_entries_by_date_range(db, start_date, end_date)


@app.put("/entries/{entry_id}", response_model=schemas.JournalEntry)
def update_entry(
    entry_id: int,
    entry: schemas.JournalEntryCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return models.update_journal_entry(db, entry_id, entry)


@app.delete("/entries/{entry_id}")
def delete_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    log.info(f"Deleting entry with ID: {entry_id}")
    models.delete_journal_entry(db, entry_id)
    return {"message": "Entry deleted successfully"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
