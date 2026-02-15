FROM python:3.11-slim

WORKDIR /app

RUN pip install --upgrade pip

COPY . /app

RUN pip install -r requirements.txt

# REMOVED: EXPOSE 80 (This allows the 80:5000 fallback)

# Updated to 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]