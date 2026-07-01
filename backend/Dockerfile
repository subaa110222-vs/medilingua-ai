# Use official lightweight Python image
FROM python:3.10-slim

# Set system environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Set working directory inside container
WORKDIR /app

# Install system dependencies (build-essential, libpq-dev for PostgreSQL adapter)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install python packages
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy backend source files
COPY . .

# Expose standard FastAPI port
EXPOSE 8000

# Start Uvicorn production server
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT}"]
