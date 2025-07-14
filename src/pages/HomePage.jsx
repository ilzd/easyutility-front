import React, { useState, useEffect, useMemo } from 'react';
import { useApi } from '../hooks/useApi';
import LineupList from '../components/LineupList';

// A simple dropdown component for reuse
const FilterDropdown = ({ label, value, onChange, options, placeholder, disabled = false }) => (
  <div className="flex flex-col">
    <label className="mb-1 text-sm font-medium text-gray-400">{label}</label>
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-cyan-500 focus:border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

function HomePage() {
  // State for filters
  const [selectedMap, setSelectedMap] = useState('');
  const [selectedGrenade, setSelectedGrenade] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');

  // Fetching data for filters
  const { data: maps } = useApi('/maps');
  const { data: selectedMapData } = useApi(selectedMap ? `/maps/${selectedMap}` : null);

  // *** FIX: Build the query string directly with useMemo ***
  // This prevents an extra state update and re-render cycle.
  const lineupQuery = useMemo(() => {
    const params = new URLSearchParams();
    if (selectedMap) params.append('mapId', selectedMap);
    if (selectedGrenade) params.append('grenadeType', selectedGrenade);
    if (selectedOrigin) params.append('origin', selectedOrigin);
    if (selectedDestination) params.append('destination', selectedDestination);
    return `/lineups?${params.toString()}`;
  }, [selectedMap, selectedGrenade, selectedOrigin, selectedDestination]);
  
  // Pass the memoized query directly to the hook
  const { data: lineups, isLoading: lineupsLoading } = useApi(lineupQuery);

  // Effect to reset dependent filters when the map is deselected
  useEffect(() => {
    if (!selectedMap) {
      setSelectedOrigin('');
      setSelectedDestination('');
    }
  }, [selectedMap]);


  const grenadeOptions = [
    { value: 'Smoke', label: 'Smoke' },
    { value: 'Flash', label: 'Flash' },
    { value: 'Molotov', label: 'Molotov' },
    { value: 'HE Grenade', label: 'HE Grenade' },
  ];

  const calloutOptions = selectedMapData?.callouts.map(c => ({ value: c.calloutId, label: c.name.en })) || [];

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Find Your Lineup</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 p-4 bg-gray-800 rounded-lg">
        <FilterDropdown
          label="Map"
          value={selectedMap}
          onChange={(e) => setSelectedMap(e.target.value)}
          options={maps?.map(m => ({ value: m._id, label: m.name })) || []}
          placeholder="Select a map"
        />
        <FilterDropdown
          label="Grenade"
          value={selectedGrenade}
          onChange={(e) => setSelectedGrenade(e.target.value)}
          options={grenadeOptions}
          placeholder="Select a grenade"
        />
        <FilterDropdown
          label="Origin"
          value={selectedOrigin}
          onChange={(e) => setSelectedOrigin(e.target.value)}
          options={calloutOptions}
          placeholder="Select origin"
          disabled={!selectedMap} // Disable if no map is selected
        />
        <FilterDropdown
          label="Destination"
          value={selectedDestination}
          onChange={(e) => setSelectedDestination(e.target.value)}
          options={calloutOptions}
          placeholder="Select destination"
          disabled={!selectedMap} // Disable if no map is selected
        />
      </div>

      <main>
        {lineupsLoading && <p className="text-center text-lg text-cyan-400">Searching for lineups...</p>}
        {lineups && <LineupList lineups={lineups} />}
        {lineups?.length === 0 && !lineupsLoading && <p className="text-center text-gray-400">No lineups found for the selected filters.</p>}
      </main>
    </div>
  );
}

export default HomePage;