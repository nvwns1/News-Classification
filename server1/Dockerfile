# Use the official Python image from the Docker Hub
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install the required packages
RUN pip install --no-cache-dir -r requirements.txt

# Install NLTK data for stopwords and punkt wordnet
RUN python -m nltk.downloader stopwords punkt wordnet

# Copy the rest of your application code into the container
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["gunicorn", "-b", "0.0.0.0:5000", "--log-level", "info", "app:app"]
