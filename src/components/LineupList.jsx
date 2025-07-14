import React from 'react';
import { Link } from 'react-router-dom';

function LineupCard({ lineup }) {
  // Find the first image or a placeholder
  const thumbnail = lineup.media.find(m => m.type === 'image')?.url || `https://placehold.co/600x400/1F2937/7DD3FC?text=${lineup.grenadeType}`;
  const originCallout = lineup.origin.calloutId.split('_').pop();
  const destinationCallout = lineup.destination.calloutId.split('_').pop();

  return (
    <Link to={`/lineup/${lineup._id}`} className="block group bg-gray-800 rounded-lg overflow-hidden hover:shadow-cyan-500/20 shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img src={thumbnail} alt={lineup.title} className="w-full h-40 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <span className="absolute top-2 right-2 bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded">{lineup.grenadeType}</span>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-white truncate group-hover:text-cyan-400">{lineup.title}</h3>
        <p className="text-sm text-gray-400 capitalize">{originCallout} → {destinationCallout}</p>
      </div>
    </Link>
  );
}

function LineupList({ lineups }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {lineups.map((lineup) => (
        <LineupCard key={lineup._id} lineup={lineup} />
      ))}
    </div>
  );
}

export default LineupList;