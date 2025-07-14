import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';

function LineupDetailPage() {
  const { id } = useParams(); // Get lineup ID from the URL
  const { data: lineup, isLoading, error } = useApi(`/lineups/${id}`);

  if (isLoading) return <p className="text-center text-lg text-cyan-400">Loading lineup...</p>;
  if (error) return <p className="text-center text-lg text-red-500">Failed to load lineup.</p>;
  if (!lineup) return null;

  const video = lineup.media.find(m => m.type === 'video');
  const images = lineup.media.filter(m => m.type === 'image');

  return (
    <div>
      <Link to="/" className="text-cyan-400 hover:text-cyan-300 mb-6 inline-block">&larr; Back to Search</Link>

      <header className="mb-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">{lineup.title}</h1>
        <p className="text-xl text-gray-400 mt-2">{lineup.mapId.name} - {lineup.grenadeType}</p>
      </header>

      {video && (
        <div className="mb-8 aspect-video">
          <iframe
            className="w-full h-full rounded-lg"
            src={video.url.replace("watch?v=", "embed/")} // Convert YouTube URL to embeddable format
            title="Lineup Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Screenshots</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {images.map((img, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-2">
                <img src={img.url} alt={img.caption || `Screenshot ${index + 1}`} className="w-full h-auto rounded" />
                {img.caption && <p className="text-center text-sm text-gray-300 mt-2">{img.caption}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Throw Details</h2>
          <ul className="space-y-3">
            <li className="flex justify-between">
              <span className="font-semibold text-gray-400">Origin:</span>
              <span className="text-white capitalize">{lineup.origin.calloutId.split('_').pop()}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-semibold text-gray-400">Destination:</span>
              <span className="text-white capitalize">{lineup.destination.calloutId.split('_').pop()}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-semibold text-gray-400">Stance:</span>
              <span className="text-white capitalize">{lineup.throwDetails.stance}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-semibold text-gray-400">Type:</span>
              <span className="text-white capitalize">{lineup.throwDetails.type}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-semibold text-gray-400">Strength:</span>
              <span className="text-white capitalize">{lineup.throwDetails.strength}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default LineupDetailPage;