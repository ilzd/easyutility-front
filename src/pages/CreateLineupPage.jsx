import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { postToAPI } from '../api';

// Reusable Input and Dropdown components
const FormInput = ({ name, value, onChange, placeholder, type = "text" }) => (
  <input 
    type={type}
    name={name} 
    value={value} 
    onChange={onChange} 
    placeholder={placeholder}
    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500" 
  />
);

const FormDropdown = ({ name, value, onChange, options, placeholder, disabled = false }) => (
  <select 
    name={name} 
    value={value} 
    onChange={onChange} 
    disabled={disabled}
    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500 disabled:opacity-50"
  >
    <option value="">{placeholder}</option>
    {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
  </select>
);


function CreateLineupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    mapId: '',
    grenadeType: '',
    originCalloutId: '',
    destinationCalloutId: '',
    videoUrl: '',
    imageUrl: '',
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all maps for the map dropdown
  const { data: maps } = useApi('/maps');
  // Fetch details of the *selected* map to get its callouts
  const { data: selectedMapData } = useApi(formData.mapId ? `/maps/${formData.mapId}` : null);

  // When the selected map changes, reset the callout selections
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      originCalloutId: '',
      destinationCalloutId: ''
    }));
  }, [formData.mapId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    // More robust validation
    if (!formData.title || !formData.mapId || !formData.grenadeType || !formData.originCalloutId || !formData.destinationCalloutId) {
        setError("Please fill out all required fields.");
        setIsSubmitting(false);
        return;
    }

    const payload = {
        title: formData.title,
        mapId: formData.mapId,
        grenadeType: formData.grenadeType,
        origin: { position: { x: 0, y: 0 }, calloutId: formData.originCalloutId },
        destination: { position: { x: 0, y: 0 }, calloutId: formData.destinationCalloutId },
        throwDetails: { stance: 'standing', type: 'normal', strength: 'normal' }, // Hardcoded for MVP
        media: [
            { type: 'video', url: formData.videoUrl },
            { type: 'image', url: formData.imageUrl, caption: 'Aim here' }
        ].filter(m => m.url)
    };

    try {
      const newLineup = await postToAPI('/lineups', payload);
      navigate(`/lineup/${newLineup._id}`);
    } catch (err) {
      setError(err.message || "Failed to create lineup.");
      setIsSubmitting(false);
    }
  };

  const grenadeOptions = [
    { value: 'Smoke', label: 'Smoke' },
    { value: 'Flash', label: 'Flash' },
    { value: 'Molotov', label: 'Molotov' },
    { value: 'HE Grenade', label: 'HE Grenade' },
  ];

  const calloutOptions = selectedMapData?.callouts.map(c => ({ value: c.calloutId, label: c.name.en })) || [];

  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-8">Create New Lineup</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg">
        <FormInput name="title" value={formData.title} onChange={handleChange} placeholder="Lineup Title (e.g. Mirage Window Smoke)" />
        
        <FormDropdown 
          name="mapId" 
          value={formData.mapId} 
          onChange={handleChange} 
          options={maps?.map(m => ({ value: m._id, label: m.name })) || []}
          placeholder="* Select a Map"
        />

        {/* FIX 1: Added Grenade Type Dropdown */}
        <FormDropdown 
          name="grenadeType" 
          value={formData.grenadeType} 
          onChange={handleChange} 
          options={grenadeOptions}
          placeholder="* Select a Grenade"
        />

        {/* FIX 2: Replaced text inputs with dependent dropdowns */}
        <FormDropdown 
          name="originCalloutId" 
          value={formData.originCalloutId} 
          onChange={handleChange} 
          options={calloutOptions}
          placeholder="* Select Origin Callout"
          disabled={!formData.mapId}
        />

        <FormDropdown 
          name="destinationCalloutId" 
          value={formData.destinationCalloutId} 
          onChange={handleChange} 
          options={calloutOptions}
          placeholder="* Select Destination Callout"
          disabled={!formData.mapId}
        />

        <FormInput name="videoUrl" value={formData.videoUrl} onChange={handleChange} placeholder="YouTube Video URL (Optional)" />
        <FormInput name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Screenshot Image URL (Optional)" />
        
        {error && <p className="text-red-400 text-center">{error}</p>}

        <button type="submit" disabled={isSubmitting} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-md disabled:bg-gray-500 transition-colors">
          {isSubmitting ? 'Submitting...' : 'Create Lineup'}
        </button>
      </form>
    </div>
  );
}

export default CreateLineupPage;