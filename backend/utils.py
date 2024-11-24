import pytz
from datetime import datetime

TIMEZONE = pytz.timezone('Asia/Shanghai')  # UTC+8

def to_local_time(dt: datetime) -> datetime:
    """Convert UTC datetime to local time (UTC+8)"""
    if dt.tzinfo is None:  # If datetime is naive, assume it's UTC
        dt = pytz.utc.localize(dt)
    return dt.astimezone(TIMEZONE)

def to_utc(dt: datetime) -> datetime:
    """Convert local time (UTC+8) to UTC"""
    if dt.tzinfo is None:  # If datetime is naive, assume it's in local time
        dt = TIMEZONE.localize(dt)
    return dt.astimezone(pytz.utc)
