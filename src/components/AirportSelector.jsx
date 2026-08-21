export default function AirportSelector({ airports, selectedId, onChange }) {
  return (
    <div className="airport-selector">
      <label htmlFor="airport-select">Airport:</label>
      <select
        id="airport-select"
        value={selectedId || ''}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        <option value="" disabled>Select an airport</option>
        {airports.map((airport) => (
          <option key={airport.id} value={airport.id}>
            {airport.code} — {airport.name} ({airport.city})
          </option>
        ))}
      </select>
    </div>
  );
}
