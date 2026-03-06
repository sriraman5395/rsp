import React, { useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchContentRef } from 'react-zoom-pan-pinch';
import { Plus, Minus, RotateCcw, X, ChevronDown, ChevronRight, ExternalLink, MapPin, Copy } from 'lucide-react';
import { Marker } from '../data/mapData';
import { motion, AnimatePresence } from 'motion/react';

interface MapViewerProps {
  imageUrl: string;
  markers: Marker[];
  onMarkerClick?: (marker: Marker) => void;
  selectedMarkerId?: string | null;
  onMarkerSelect?: (id: string | null) => void;
}

const AccordionItem = ({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-yellow-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2 px-3 text-left bg-yellow-50/50 hover:bg-yellow-50 transition-colors"
      >
        <span className="text-xs font-bold text-slate-700">{title}</span>
        {isOpen ? <ChevronDown size={14} className="text-yellow-600" /> : <ChevronRight size={14} className="text-yellow-600" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-white"
          >
            <div className="px-3 pb-3 pt-2 text-xs text-slate-600 space-y-1">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const MapViewer: React.FC<MapViewerProps> = ({ 
  imageUrl, 
  markers, 
  onMarkerClick, 
  selectedMarkerId: propSelectedMarkerId,
  onMarkerSelect
}) => {
  const transformComponentRef = React.useRef<ReactZoomPanPinchContentRef>(null);
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);
 
  const [internalSelectedMarkerId, setInternalSelectedMarkerId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [isPlotting, setIsPlotting] = useState(false);
  const [plottedPoint, setPlottedPoint] = useState<{x: number, y: number} | null>(null);
  const [images, setImages] = useState<{id: number, url: string, caption: string}[]>([]);
  const [selectedImage, setSelectedImage] = useState<{id: number, url: string, caption: string} | null>(null);
  
  const selectedMarkerId = propSelectedMarkerId !== undefined ? propSelectedMarkerId : internalSelectedMarkerId;
  const handleMarkerSelect = (id: string | null) => {
    if (onMarkerSelect) {
      onMarkerSelect(id);
    } else {
      setInternalSelectedMarkerId(id);
    }
  };

  useEffect(() => {
  if (!selectedMarkerId) {
    setImages([]);
    return;
  }

  const API_BASE =
    (import.meta as any)?.env?.VITE_API_URL ||
    "";

fetch(`${API_BASE}/api/markers/${selectedMarkerId}/images`)
  .then(res => res.json())
  .then(data => {
    console.log("images from API:", data);
    setImages(data);
  });

}, [selectedMarkerId]);

  const handleZoomIn = () => {
    if (transformComponentRef.current) {
      transformComponentRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (transformComponentRef.current) {
      transformComponentRef.current.zoomOut();
    }
  };

  const handleReset = () => {
    if (transformComponentRef.current) {
      transformComponentRef.current.resetTransform();
    }
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPlotting) {
      const imgElement = e.currentTarget.querySelector('img');
      if (imgElement) {
        const rect = imgElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;
        
        setPlottedPoint({ x: xPercent, y: yPercent });
      }
      return;
    }

    if (selectedMarkerId) {
      handleMarkerSelect(null);
      return;
    }
  };

  const copyCoordinates = () => {
    if (plottedPoint) {
      const text = `x: ${plottedPoint.x.toFixed(2)},\ny: ${plottedPoint.y.toFixed(2)},`;
      navigator.clipboard.writeText(text);
      alert("Coordinates copied to clipboard!");
    }
  };

  return (
    <div className="relative w-full h-full bg-white overflow-hidden group">
      {/* Controls Overlay */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        
        <button
          onClick={handleZoomIn}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-slate-50 text-slate-700 transition-colors border border-slate-200 cursor-pointer"
          title="Zoom In"
        >
          <Plus size={20} />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-slate-50 text-slate-700 transition-colors border border-slate-200 cursor-pointer"
          title="Zoom Out"
        >
          <Minus size={20} />
        </button>
        <button
          onClick={handleReset}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-slate-50 text-slate-700 transition-colors border border-slate-200 cursor-pointer"
          title="Reset View"
        >
          <RotateCcw size={20} />
        </button>
        <div className="h-px bg-slate-200 my-1" />
        <button
          onClick={() => {
            setIsPlotting(!isPlotting);
            setPlottedPoint(null);
          }}
          className={`p-2 rounded-lg shadow-md transition-colors border cursor-pointer ${isPlotting ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'}`}
          title="Plot Point"
        >
          <MapPin size={20} />
        </button>
      </div>

      {/* Plotted Point Info Overlay */}
      {isPlotting && plottedPoint && (
        <div className="absolute top-4 left-4 z-50 bg-white p-3 rounded-lg shadow-xl border border-slate-200 max-w-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase">Plotted Point</h3>
            <button onClick={copyCoordinates} className="text-indigo-600 hover:text-indigo-800" title="Copy">
              <Copy size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm font-mono text-slate-700">
            <div>x: {plottedPoint.x.toFixed(2)}</div>
            <div>y: {plottedPoint.y.toFixed(2)}</div>
          </div>
        </div>
      )}

      <TransformWrapper
        ref={transformComponentRef}
        initialScale={1} // Scale must be > 1 to allow scrolling/positioning
        initialPositionX={0}
        initialPositionY={0} // Negative value moves view down (scrolls down)
        minScale={0.9}
        maxScale={8}
        centerOnInit={false}
        wheel={{ step: 0.1 }}
        onTransformed={(e) => setScale(e.state.scale)}
      >
        {({ zoomToElement }) => (
          <TransformComponent
            wrapperClass="w-full h-full"
            contentClass="w-full h-full flex items-center justify-center"
          >
            <div 
              className={`relative bg-white ${isPlotting ? 'cursor-crosshair' : ''}`}
              onClick={handleMapClick}
              style={{ cursor: isPlotting ? 'crosshair' : 'grab' }}
            >
              <img
                src={imageUrl}
                alt="Interactive Map"
                className="block h-full w-auto max-w-none md:h-auto md:w-auto md:max-w-full md:max-h-full"
                onDragStart={(e) => e.preventDefault()}
              />

              {/* Plotted Point Marker */}
              {isPlotting && plottedPoint && (
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
                  style={{
                    left: `${plottedPoint.x}%`,
                    top: `${plottedPoint.y}%`,
                  }}
                >
                  <div className="text-indigo-600 drop-shadow-md">
                    <MapPin size={32} fill="currentColor" className="text-indigo-600" />
                  </div>
                </div>
              )}

              {markers.map((marker) => {
                const isSelected = selectedMarkerId === marker.id;
                
                return (
                  <div
                    key={marker.id}
                    id={`marker-${marker.id}`}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ${isSelected ? 'z-50' : 'z-20'}`}
                    style={{
                      left: `${marker.x}%`,
                      top: `${marker.y}%`,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkerSelect(isSelected ? null : marker.id);
                      if (onMarkerClick) onMarkerClick(marker);
                    }}
                    onMouseEnter={() => setHoveredMarker(marker.id)}
                    onMouseLeave={() => setHoveredMarker(null)}
                  >
                    <div className="relative group/pin">
                      {/* Custom "LC NO" Marker */}
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
                          flex items-center justify-center
                          px-2 py-1 rounded-md shadow-md
                          text-[10px] font-bold tracking-tighter
                          transition-all duration-200
                          opacity-0
                          ${isSelected 
                            ? 'bg-yellow-400 text-slate-900 z-30 ring-4 ring-yellow-400/30 scale-110' 
                            : 'bg-yellow-300 text-slate-900'}
                        `}
                        style={{
                          minWidth: '40px'
                        }}
                      >
                        LC No: {marker["LC No"]}
                      </motion.div>
                      
                      
                    </div>
                  </div>
                );
              })}
            </div>
          </TransformComponent>
        )}
      </TransformWrapper>
      
      {/* Right Side Floating Card Overlay */}
      <AnimatePresence>
        {selectedMarkerId && (() => {
          const marker = markers.find(m => m.id === selectedMarkerId);
          if (!marker) return null;
          
          return (
            <div className="fixed inset-y-0 right-4 z-[100] flex items-center pointer-events-none">
              <motion.div
                initial={{ x: 20, opacity: 0, scale: 0.95 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: 20, opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="w-80 bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col pointer-events-auto overflow-hidden max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Card Header - White Background */}
                <div className="p-4 bg-white border-b border-slate-100 flex-shrink-0 relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkerSelect(null);
                    }}
                    className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    <X size={16} />
                  </button>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1 pr-6">
                      {marker["ROB/RUB/BOTH"]} <span className="text-xs font-bold text-slate-900 uppercase tracking-wide align-middle">in lieu of</span> LC {marker["LC No"]}
                    </h2>
                  </div>
                </div>
                
                <div className="overflow-y-auto flex-1 bg-white scrollbar-thin scrollbar-thumb-yellow-200 scrollbar-track-transparent">
                  {/* Primary Details Section */}
                  <div className="p-4 space-y-3 text-xs text-slate-600 border-b border-yellow-100 bg-slate-50/50">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase mb-0.5 font-semibold">Location</span>
                        <span className="font-bold text-slate-800 text-sm">{marker.Location}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase mb-0.5 font-semibold">Division</span>
                        <span className="font-bold text-slate-800 text-sm">{marker.Division}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase mb-0.5 font-semibold">Chainage</span>
                        <span className="font-medium text-slate-700">{marker.Chainage}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase mb-0.5 font-semibold">District</span>
                        <span className="font-medium text-slate-700">{marker.District}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase mb-0.5 font-semibold">Section</span>
                        <span className="font-medium text-slate-700">{marker.Section}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase mb-0.5 font-semibold">State Govt. Agency</span>
                        <span className="font-medium text-slate-700">{marker["State government agency"]}</span>
                      </div>
                    </div>
                  </div>

                  <AccordionItem title="Technical Details">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {Object.entries(marker["Technical Details"]).map(([key, value]) => (
                        <div key={key} className="flex flex-col">
                          <span className="text-slate-400 text-[10px] leading-tight mb-0.5 font-semibold">{key}</span>
                          <span className="font-medium text-slate-700 break-words">{value || '-'}</span>
                        </div>
                      ))}
                    </div>
                  </AccordionItem>

                  <AccordionItem title="Details of Cost">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {Object.entries(marker["Details of Cost"]).map(([key, value]) => (
                        <div key={key} className="flex flex-col">
                          <span className="text-slate-400 text-[10px] leading-tight mb-0.5 font-semibold">{key}</span>
                          <span className="font-medium text-slate-700">
                            {typeof value === 'number' ? `₹${value.toLocaleString()}` : value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </AccordionItem>

                  <AccordionItem title="Present Status">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {Object.entries(marker["Present Status"]).map(([key, value]) => (
                        <div key={key} className="flex flex-col col-span-2">
                          <span className="text-slate-400 text-[10px] leading-tight mb-0.5 font-semibold">{key}</span>
                          <p className="font-medium text-slate-700 mt-0.5">{value || '-'}</p>
                        </div>
                      ))}
                    </div>
                  </AccordionItem>

                  <AccordionItem title="Images">
                    {images.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {images.map((img) => (
                          <div 
                            key={img.id} 
                            className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
                            onClick={() => setSelectedImage(img)}
                          >
                            <img 
                              src={img.url} 
                              alt={img.caption} 
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 italic">No images available</p>
                    )}
                  </AccordionItem>
                </div>

                {/* Footer with Navigate Button */}
                <div className="p-4 bg-white border-t border-slate-100 flex-shrink-0">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${marker.Location}, ${marker.District}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 text-sm font-bold rounded-lg transition-colors shadow-sm"
                  >
                    <ExternalLink size={16} />
                    Navigate to Asset
                  </a>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* Image Viewer Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
            <div className="max-w-5xl max-h-full w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
              <img 
                src={selectedImage.url} 
                alt={selectedImage.caption} 
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
              <p className="mt-4 text-white text-lg font-medium">{selectedImage.caption}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
