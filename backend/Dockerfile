# Use Python 3.11 as the base image
FROM python:3.11-slim

# Set working directory in the container
WORKDIR /app

# Copy the backend requirements
COPY pyproject.toml README.md ./

# Install build dependencies and Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && pip install --no-cache-dir pip-tools \
    && pip install --no-cache-dir fastapi>=0.115.5 pydantic>=2.9.2 sqlalchemy>=2.0.36 uvicorn>=0.32.0 \
    && apt-get purge -y --auto-remove build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy the backend code
COPY . .

# Create a non-root user and switch to it
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["python", "main.py"]
