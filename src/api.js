// Set these in a .env file
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api';

// These must match app.security.username / app.security.password on the backend.
const AUTH_PASSWORD = import.meta.env.VITE_API_PASSWORD || 'aviation123';

function authHeader() {
  const token = btoa(`${AUTH_USERNAME}:${AUTH_PASSWORD}`);
  return `Basic ${token}`;
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${response.status}`);
  }

  // DELETE returns 204 No Content - nothing to parse
  if (response.status === 204) return null;
  return response.json();
}

// Airports 
export const getAirports = () => request('/airports');
export const createAirport = (airport) => request('/airports', { method: 'POST', body: JSON.stringify(airport) });
export const updateAirport = (id, airport) => request(`/airports/${id}`, { method: 'PUT', body: JSON.stringify(airport) });
export const deleteAirport = (id) => request(`/airports/${id}`, { method: 'DELETE' });

// Airlines 
export const getAirlines = () => request('/airlines');
export const createAirline = (airline) => request('/airlines', { method: 'POST', body: JSON.stringify(airline) });
export const deleteAirline = (id) => request(`/airlines/${id}`, { method: 'DELETE' });

// Gates 
export const getGatesByAirport = (airportId) => request(`/gates/airport/${airportId}`);
export const createGate = (gate) => request('/gates', { method: 'POST', body: JSON.stringify(gate) });
export const deleteGate = (id) => request(`/gates/${id}`, { method: 'DELETE' });

// Flights 
export const getDepartures = (airportId) => request(`/flights/departures/${airportId}`);
export const getArrivals = (airportId) => request(`/flights/arrivals/${airportId}`);
export const createFlight = (flight) => request('/flights', { method: 'POST', body: JSON.stringify(flight) });
export const updateFlight = (id, flight) => request(`/flights/${id}`, { method: 'PUT', body: JSON.stringify(flight) });
export const deleteFlight = (id) => request(`/flights/${id}`, { method: 'DELETE' });
