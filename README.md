# WebCTF

## Setup

1. Setup a PostgreSQL database (locally, in the cloud, etc.)

2. Initialize the database
    ```sh
    psql "postgresql://<connection-string>" -f models/init.sql -f models/test-data.sql
    ```

3. Add PostgreSQL settings to `.env`
    ```
    PGUSER="username"
    PGHOST="host"
    PGDATABASE="database-name"
    PGPASSWORD="password"
    PGPORT=1234
    ```

5. Install dependencies
    ```sh
    npm install
    ```

5. Run server
    ```sh
    npm start
    ```

6. Access WebCTF at [http://localhost:3000](http://localhost:3000)
