# Research Collaborator and Interest Matcher

A Spring Boot REST API that matches researchers based on their research interests.

## Features

- REST API endpoint to find researchers by interest keyword
- Hardcoded dataset of 8 researchers with diverse interests
- Case-insensitive matching
- CORS enabled for frontend integration
- Comprehensive unit tests
- Docker support for containerization

## API Endpoints

### Match Researchers
```
GET /api/match?interest=keyword
```

**Example Request:**
```
http://localhost:8080/api/match?interest=AI
```

**Example Response:**
```json
{
  "interest": "AI",
  "matches": [
    "Dr. Sarah Chen",
    "Dr. Emily Johnson", 
    "Prof. David Kim",
    "Dr. Maria Garcia"
  ],
  "count": 4
}
```

### Health Check
```
GET /api/health
```

## Quick Start

### Prerequisites
- Java 17
- Maven 3.6+

### Run Locally
```bash
cd research-matcher
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`

### Run Tests
```bash
./mvnw test
```

## Docker Deployment

### Build Docker Image
```bash
docker build -t research-matcher .
```

### Run Container
```bash
docker run -p 8080:8080 research-matcher
```

## Deploy to Render.com

1. **Create a new Web Service** on Render.com
2. **Connect your GitHub repository**
3. **Configure the service:**
   - **Environment:** Docker
   - **Build Command:** `docker build -t research-matcher .`
   - **Start Command:** `docker run -p $PORT:8080 research-matcher`
   - **Port:** 8080

4. **Environment Variables:**
   - `PORT=8080` (Render will set this automatically)

5. **Deploy** - Render will automatically build and deploy your application

Your API will be available at: `https://your-app-name.onrender.com`

## Dataset

The application includes 8 researchers with interests in:
- AI & Machine Learning
- Blockchain & Cryptography  
- Quantum Computing
- Cybersecurity
- Data Science
- Bioinformatics
- IoT & Edge Computing

## Technology Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Web**
- **Lombok**
- **JUnit 5**
- **Maven**
- **Docker**