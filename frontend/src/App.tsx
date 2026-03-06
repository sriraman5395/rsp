/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MapViewer } from './components/MapViewer';
import { INITIAL_MARKERS, Marker } from './data/mapData';
import { Navigation, Search, X } from 'lucide-react';

// Using a local placeholder that prompts upload
const DEFAULT_MAP_IMAGE_URL = "/site-mapping-latest.jpg";

export default function App() {
  const [markers, setMarkers] = useState<Marker[]>(INITIAL_MARKERS);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mapImageUrl, setMapImageUrl] = useState(DEFAULT_MAP_IMAGE_URL);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

  const selectedMarker = markers.find(m => m.id === selectedMarkerId);

  const handleMarkerClick = (marker: Marker) => {
    // Logic can be added here if needed, but the card is now handled inside MapViewer
    console.log("Marker clicked:", marker.Location);
    setSelectedMarkerId(marker.id);
  };

  const filteredMarkers = markers.filter(marker => {
    const searchLower = searchTerm.toLowerCase();
    return (
      marker.Location.toLowerCase().includes(searchLower) ||
      marker["LC No"].toLowerCase().includes(searchLower) ||
      (marker.Division && marker.Division.toLowerCase().includes(searchLower)) ||
      (marker.Section && marker.Section.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Sidebar */}
      <div 
        className={`
          flex-shrink-0 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col
          ${sidebarOpen ? 'w-80' : 'w-12'}
        `}
      >
        <div className={`border-b border-slate-100 flex items-center transition-all duration-300 ${sidebarOpen ? 'p-6 justify-between' : 'p-3 justify-center'}`}>
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="bg-yellow-500 p-1.5 rounded-lg">
                <Navigation className="w-5 h-5 text-slate-900" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                {selectedMarker ? selectedMarker.Location : "Project Location"}
              </h1>
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Search size={20} />}
          </button>
        </div>

        <div className={`flex-1 flex flex-col overflow-hidden transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 invisible'}`}>
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search LC No, Location, Division, Section..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 pt-0 space-y-3">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-2">Locations</h2>
          {filteredMarkers.map(marker => (
            <button
              key={marker.id}
              onClick={() => handleMarkerClick(marker)}
              className={`
                w-full text-left p-3 rounded-xl border transition-all duration-200 group 
                ${selectedMarkerId === marker.id ? 'bg-yellow-50 border-yellow-200 ring-1 ring-yellow-200' : 'bg-white border-slate-100 hover:border-indigo-200 hover:bg-slate-50'}
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`
                  mt-0.5 w-2 h-2 rounded-full flex-shrink-0 bg-yellow-500
                `} />
                <div>
                  <div className="font-medium text-sm text-slate-700">
                    LC {marker["LC No"]} - {marker.Location} ({marker.Division})
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                    {marker.Section}
                  </div>
                </div>
              </div>
            </button>
          ))}
          {filteredMarkers.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-sm">
              No locations found
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Map Area */}
        <div className="flex-1 bg-white overflow-hidden relative">
          <MapViewer 
            imageUrl={mapImageUrl} 
            markers={markers}
            onMarkerClick={handleMarkerClick}
            selectedMarkerId={selectedMarkerId}
            onMarkerSelect={setSelectedMarkerId}
          />
        </div>
      </div>
    </div>
  );
}
