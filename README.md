# Airport Arrivals & Departures — Frontend

React (Vite) frontend for the Airport Arrivals & Departures app. This is the frontend half of a two repo project see the https://github.com/PatrickTobin15/aviation-backend/tree/main for the API, entity design, and full project README (architecture, user stories, deployment steps).

## Running Locally

```bash
cp .env.example .env
npm install
npm run dev
```

Runs on `http://localhost:5173`. Requires the backend API running (defaults to `http://localhost:8080/api` — edit `.env` to point elsewhere, e.g. your deployed EC2 backend).

## Running with Docker

```bash
docker build -t aviation-frontend \
  --build-arg VITE_API_BASE=http://localhost:8080/api \
  --build-arg VITE_API_USERNAME=admin \
  --build-arg VITE_API_PASSWORD=aviation123 .
docker run -p 5173:80 aviation-frontend
```

Vite bakes environment variables in at the build time, so that they are passed as `--build-arg` values rather than a runtime env vars. For an AWS deploy, you would want to swap `VITE_API_BASE` for a EC2 backend's public DNS/IP.

## Structure

```
src/
├── api.js               # API client that adds a Basic Auth headers to every single request
├── App.jsx               # Main app shell nav, airport board, and an admin toggle
├── App.css
└── components/
    ├── AirportSelector.jsx  # A Dropdown to switch airports
    ├── FlightTable.jsx      # This will display arrivals or departures
    └── AdminPanel.jsx       # The forms to add any airports, airlines, gates, or flights
```

## Manual Testing Scenarios

1. Load the app and the departures board loads for the first airport in the list.
2. Switch airports via the dropdown and the board updates accordingly.
3. Switch between Departures / Arrivals tabs.
4. Admin -> Airports: add a new airport, confirm it appears in the dropdown.
5. Admin -> Airlines: add an airline, confirm it's selectable when creating a flight.
6. Admin -> Gates: add a gate that is tied to an airport, confirm it's selectable on a flight.
7. Admin -> Flights: add a flight, and then confirm it shows on the correct airport's board.
8. Submit a form with a required field blank abd a browser will block submission.
