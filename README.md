# ghtapp

## Deployment

To run the application in production mode using Docker Compose:

1.  **Build and start the services:**

    ```bash
    docker compose -f compose.prod.yml up --build -d
    ```

2.  **Access the application:**
    - Frontend: `http://localhost`
    - Backend API: `http://localhost:5001`

3.  **Stop the services:**
    ```bash
    docker compose -f compose.prod.yml down
    ```

## Developmentapp
