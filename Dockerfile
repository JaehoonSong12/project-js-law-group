FROM python:3.11-slim

WORKDIR /app

# Upgrade pip
RUN pip install --upgrade pip

COPY . /app

# Install dependencies
RUN pip install -r requirements.txt

# Flask runs on 5000 by default, expose it so Dokku sees it
EXPOSE 5000

# Command to run your app (adjust 'app:app' to your file_name:flask_variable)
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
