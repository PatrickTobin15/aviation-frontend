function formatTime(dateTimeStr) {
  if (!dateTimeStr) return '—';
  const date = new Date(dateTimeStr);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function FlightTable({ flights, mode }) {
  if (!flights || flights.length === 0) {
    return <p className="empty-state">No {mode} scheduled for this airport yet.</p>;
  }

  return (
    <table className="flight-table">
      <thead>
        <tr>
          <th>Flight</th>
          <th>Airline</th>
          <th>{mode === 'departures' ? 'Destination' : 'Origin'}</th>
          <th>Gate</th>
          <th>Scheduled</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {flights.map((flight) => (
          <tr key={flight.id}>
            <td>{flight.flightNumber}</td>
            <td>{flight.airline?.name} ({flight.airline?.iataCode})</td>
            <td>
              {mode === 'departures'
                ? `${flight.destinationAirport?.code} — ${flight.destinationAirport?.city}`
                : `${flight.originAirport?.code} — ${flight.originAirport?.city}`}
            </td>
            <td>{flight.gate?.gateNumber || '—'}</td>
            <td>{formatTime(flight.scheduledTime)}</td>
            <td>
              <span className={`status-badge status-${flight.status?.toLowerCase()}`}>
                {flight.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
