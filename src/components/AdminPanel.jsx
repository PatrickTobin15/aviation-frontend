import { useState } from 'react';
import * as api from '../api';

const emptyAirport = { code: '', name: '', city: '', country: '' };
const emptyAirline = { name: '', iataCode: '' };
const emptyGate = { gateNumber: '', airport: { id: '' } };
const emptyFlight = {
  flightNumber: '',
  airline: { id: '' },
  originAirport: { id: '' },
  destinationAirport: { id: '' },
  gate: { id: '' },
  scheduledTime: '',
  status: 'SCHEDULED',
};

export default function AdminPanel({ airports, airlines, onDataChanged }) {
  const [tab, setTab] = useState('airport');
  const [airportForm, setAirportForm] = useState(emptyAirport);
  const [airlineForm, setAirlineForm] = useState(emptyAirline);
  const [gateForm, setGateForm] = useState(emptyGate);
  const [flightForm, setFlightForm] = useState(emptyFlight);
  const [message, setMessage] = useState(null);

  const showMessage = (text, isError = false) => {
    setMessage({ text, isError });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAirportSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createAirport(airportForm);
      setAirportForm(emptyAirport);
      showMessage('Airport added.');
      onDataChanged();
    } catch (err) {
      showMessage(err.message, true);
    }
  };

  const handleAirlineSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createAirline(airlineForm);
      setAirlineForm(emptyAirline);
      showMessage('Airline added.');
      onDataChanged();
    } catch (err) {
      showMessage(err.message, true);
    }
  };

  const handleGateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createGate({
        gateNumber: gateForm.gateNumber,
        airport: { id: Number(gateForm.airport.id) },
      });
      setGateForm(emptyGate);
      showMessage('Gate added.');
      onDataChanged();
    } catch (err) {
      showMessage(err.message, true);
    }
  };

  const handleFlightSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createFlight({
        flightNumber: flightForm.flightNumber,
        airline: { id: Number(flightForm.airline.id) },
        originAirport: { id: Number(flightForm.originAirport.id) },
        destinationAirport: { id: Number(flightForm.destinationAirport.id) },
        gate: flightForm.gate.id ? { id: Number(flightForm.gate.id) } : null,
        scheduledTime: flightForm.scheduledTime,
        status: flightForm.status,
      });
      setFlightForm(emptyFlight);
      showMessage('Flight added.');
      onDataChanged();
    } catch (err) {
      showMessage(err.message, true);
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-tabs">
        <button className={tab === 'airport' ? 'active' : ''} onClick={() => setTab('airport')}>Airports</button>
        <button className={tab === 'airline' ? 'active' : ''} onClick={() => setTab('airline')}>Airlines</button>
        <button className={tab === 'gate' ? 'active' : ''} onClick={() => setTab('gate')}>Gates</button>
        <button className={tab === 'flight' ? 'active' : ''} onClick={() => setTab('flight')}>Flights</button>
      </div>

      {message && (
        <div className={`admin-message ${message.isError ? 'error' : 'success'}`}>{message.text}</div>
      )}

      {tab === 'airport' && (
        <form className="admin-form" onSubmit={handleAirportSubmit}>
          <h3>Add Airport</h3>
          <input placeholder="Code (e.g. YYZ)" value={airportForm.code}
            onChange={(e) => setAirportForm({ ...airportForm, code: e.target.value })} required />
          <input placeholder="Name" value={airportForm.name}
            onChange={(e) => setAirportForm({ ...airportForm, name: e.target.value })} required />
          <input placeholder="City" value={airportForm.city}
            onChange={(e) => setAirportForm({ ...airportForm, city: e.target.value })} required />
          <input placeholder="Country" value={airportForm.country}
            onChange={(e) => setAirportForm({ ...airportForm, country: e.target.value })} required />
          <button type="submit">Add Airport</button>
        </form>
      )}

      {tab === 'airline' && (
        <form className="admin-form" onSubmit={handleAirlineSubmit}>
          <h3>Add Airline</h3>
          <input placeholder="Name" value={airlineForm.name}
            onChange={(e) => setAirlineForm({ ...airlineForm, name: e.target.value })} required />
          <input placeholder="IATA Code (e.g. AC)" value={airlineForm.iataCode}
            onChange={(e) => setAirlineForm({ ...airlineForm, iataCode: e.target.value })} required />
          <button type="submit">Add Airline</button>
        </form>
      )}

      {tab === 'gate' && (
        <form className="admin-form" onSubmit={handleGateSubmit}>
          <h3>Add Gate</h3>
          <input placeholder="Gate Number (e.g. B12)" value={gateForm.gateNumber}
            onChange={(e) => setGateForm({ ...gateForm, gateNumber: e.target.value })} required />
          <select value={gateForm.airport.id}
            onChange={(e) => setGateForm({ ...gateForm, airport: { id: e.target.value } })} required>
            <option value="" disabled>Select airport</option>
            {airports.map((a) => <option key={a.id} value={a.id}>{a.code} — {a.name}</option>)}
          </select>
          <button type="submit">Add Gate</button>
        </form>
      )}

      {tab === 'flight' && (
        <form className="admin-form" onSubmit={handleFlightSubmit}>
          <h3>Add Flight</h3>
          <input placeholder="Flight Number (e.g. AC456)" value={flightForm.flightNumber}
            onChange={(e) => setFlightForm({ ...flightForm, flightNumber: e.target.value })} required />
          <select value={flightForm.airline.id}
            onChange={(e) => setFlightForm({ ...flightForm, airline: { id: e.target.value } })} required>
            <option value="" disabled>Select airline</option>
            {airlines.map((a) => <option key={a.id} value={a.id}>{a.name} ({a.iataCode})</option>)}
          </select>
          <select value={flightForm.originAirport.id}
            onChange={(e) => setFlightForm({ ...flightForm, originAirport: { id: e.target.value } })} required>
            <option value="" disabled>Origin airport</option>
            {airports.map((a) => <option key={a.id} value={a.id}>{a.code} — {a.name}</option>)}
          </select>
          <select value={flightForm.destinationAirport.id}
            onChange={(e) => setFlightForm({ ...flightForm, destinationAirport: { id: e.target.value } })} required>
            <option value="" disabled>Destination airport</option>
            {airports.map((a) => <option key={a.id} value={a.id}>{a.code} — {a.name}</option>)}
          </select>
          <input type="datetime-local" value={flightForm.scheduledTime}
            onChange={(e) => setFlightForm({ ...flightForm, scheduledTime: e.target.value })} required />
          <select value={flightForm.status}
            onChange={(e) => setFlightForm({ ...flightForm, status: e.target.value })}>
            {['SCHEDULED', 'BOARDING', 'DEPARTED', 'IN_AIR', 'LANDED', 'DELAYED', 'CANCELLED'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button type="submit">Add Flight</button>
        </form>
      )}
    </div>
  );
}
