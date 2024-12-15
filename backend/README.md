# Ekko Backend Assignment

## Table of Contents
- [Introduction](#introduction)
- [Technologies](#technologies)
- [Setup](#setup)
- [Running the Application](#running-the-application)
- [Running Tests](#running-tests)
- [CI/CD Pipeline](#cicd-pipeline)
- [Docker](#docker)

## Introduction
This project is an Express.js backend application for the Ekko Backend Assignment. It includes a CI/CD pipeline, Docker support, and uses PostgreSQL as the database.

## Technologies
- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Docker
- GitHub Actions

## Setup
1. Clone the repository:
    ```sh
    git clone <repository-url>
    cd backend
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the `backend` directory and add the following environment variables:
    ```env
    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=postgres
    DB_PASSWORD=postgres
    DB_NAME=ekko_roles
    ```

4. Run database migrations:
    ```sh
    npm run migration:run
    ```

## Running the Application
To start the application in development mode:
```sh
npm run dev
```

To build and start the application in production mode:
```sh
npm run build
npm run start
```

## Running tests
To run the tests:
```sh
npm run test
```

## CI/CD Pipeline
The CI/CD pipeline is configured using GitHub Actions. It includes the following jobs:  
- build-and-test: Runs on every push and pull request to the main branch. It checks out the code, sets up Node.js, installs dependencies, waits for PostgreSQL, creates a test database, runs the linter, and runs the tests.
- deploy: Runs after the build-and-test job. It builds and pushes the Docker image to Google Container Registry and deploys the application to Google Cloud Run.

## Docker
To build and run the Docker container:  
- Build the Docker image:
```sh
docker build -t ekko-backend .
```

Run the Docker container:  
```sh
docker run -p 4000:4000 ekko-backend
```

The application will be available at http://localhost:4000.