'use client'
import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in React
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom icons for different facility types
const createCustomIcon = (color = '#3b82f6') => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  })
}

const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: `<div style="background-color: #ef4444; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(239, 68, 68, 0.5); animation: pulse 2s infinite;"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10],
})

function MapView({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.setView(center, zoom)
    }
  }, [center, zoom, map])
  return null
}

export default function FacilityMap({ 
  userLocation = null, 
  facilities = [], 
  onFacilityClick = null,
  center = null,
  zoom = 13
}) {
  const [mapCenter, setMapCenter] = useState(center || [19.0760, 72.8777]) // Default to Mumbai
  const [mapZoom, setMapZoom] = useState(zoom)

  useEffect(() => {
    if (userLocation) {
      setMapCenter([userLocation.latitude, userLocation.longitude])
      setMapZoom(14)
    } else if (facilities.length > 0 && facilities[0].latitude && facilities[0].longitude) {
      setMapCenter([facilities[0].latitude, facilities[0].longitude])
    }
  }, [userLocation, facilities])

  const getFacilityColor = (type) => {
    switch (type) {
      case 'hospital': return '#ef4444'
      case 'clinic': return '#3b82f6'
      case 'pharmacy': return '#10b981'
      case 'diagnostic_center': return '#f59e0b'
      case 'emergency': return '#dc2626'
      default: return '#6b7280'
    }
  }

  return (
    <div style={{ height: '100%', width: '100%', borderRadius: '1rem', overflow: 'hidden' }}>
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapView center={mapCenter} zoom={mapZoom} />

        {/* User Location Marker */}
        {userLocation && (
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={userLocationIcon}
          >
            <Popup>
              <div className="text-sm font-semibold">
                📍 Your Location
              </div>
            </Popup>
          </Marker>
        )}

        {/* Facility Markers */}
        {facilities.map((facility, index) => {
          if (!facility.latitude || !facility.longitude) return null
          
          return (
            <Marker
              key={index}
              position={[facility.latitude, facility.longitude]}
              icon={createCustomIcon(getFacilityColor(facility.type))}
              eventHandlers={{
                click: () => {
                  if (onFacilityClick) {
                    onFacilityClick(facility)
                  }
                }
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-bold text-sm mb-1">{facility.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">{facility.address}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full capitalize">
                      {facility.type.replace('_', ' ')}
                    </span>
                    {facility.rating && (
                      <span className="text-yellow-600">⭐ {facility.rating}</span>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
      
      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .custom-marker,
        .user-location-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .leaflet-popup-content {
          margin: 12px;
          font-family: system-ui, -apple-system, sans-serif;
        }
      `}</style>
    </div>
  )
}
