FROM python:3.11-slim

WORKDIR /app

# Upgrade pip
RUN pip install --upgrade pip

COPY . /app

# Install dependencies
RUN pip install -r requirements.txt

# Flask runs on 80, expose it so Dokku sees it
EXPOSE 80

# Command to run your app (adjust 'app:app' to your file_name:flask_variable)
CMD ["gunicorn", "--bind", "0.0.0.0:80", "app:app"]
