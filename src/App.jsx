import { useEffect, useState, useCallback } from 'react';
import * as api from './api';
import AirportSelector from './components/AirportSelector';
import FlightTable from './components/FlightTable';
import AdminPanel from './components/AdminPanel';

function App() {
  const [airports, setAirports] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [selectedAirportId, setSelectedAirportId] = useState(null);
  const [departures, setDepartures] = useState([]);
  const [arrivals, setArrivals] = useState([]);
  const [view, setView] = useState('departures'); // 'departures' | 'arrivals' | 'admin'
  const [error, setError] = useState(null);

  const loadAirports = useCallback(async () => {
    try {
      const data = await api.getAirports();
      setAirports(data);
      if (data.length > 0 && !selectedAirportId) {
        setSelectedAirportId(data[0].id);
      }
    } catch (err) {
      setError(err.message);
    }
  }, [selectedAirportId]);

  const loadAirlines = useCallback(async () => {
    try {
      setAirlines(await api.getAirlines());
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const loadFlights = useCallback(async (airportId) => {
    if (!airportId) return;
    try {
      const [dep, arr] = await Promise.all([
        api.getDepartures(airportId),
        api.getArrivals(airportId),
      ]);
      setDepartures(dep);
      setArrivals(arr);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    loadAirports();
    loadAirlines();
  }, []);

  useEffect(() => {
    if (selectedAirportId) {
      loadFlights(selectedAirportId);
    }
  }, [selectedAirportId, loadFlights]);

  const handleDataChanged = () => {
    loadAirports();
    loadAirlines();
    if (selectedAirportId) loadFlights(selectedAirportId);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>✈️ Airport Arrivals & Departures</h1>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <nav className="main-nav">
        <button className={view === 'departures' ? 'active' : ''} onClick={() => setView('departures')}>Departures</button>
        <button className={view === 'arrivals' ? 'active' : ''} onClick={() => setView('arrivals')}>Arrivals</button>
        <button className={view === 'admin' ? 'active' : ''} onClick={() => setView('admin')}>Admin</button>
      </nav>

      {view !== 'admin' && (
        <div className="board-view">
          <AirportSelector
            airports={airports}
            selectedId={selectedAirportId}
            onChange={setSelectedAirportId}
          />
          <FlightTable
            flights={view === 'departures' ? departures : arrivals}
            mode={view}
          />
        </div>
      )}

      {view === 'admin' && (
        <AdminPanel
          airports={airports}
          airlines={airlines}
          onDataChanged={handleDataChanged}
        />
      )}
    </div>
  );
}

export default App;
