"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";

interface BookingMapProps {
  pickupCoords: { lat: number; lon: number } | null;
  dropoffCoords: { lat: number; lon: number } | null;
}

export default function BookingMap({ pickupCoords, dropoffCoords }: BookingMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ pickup?: L.Marker; dropoff?: L.Marker }>({});
  const routeRef = useRef<L.Polyline | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);

  // Initialize map container and load CartoDB Dark Matter tiles
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Centered initially at Toronto, Canada
    const map = L.map(mapContainerRef.current, {
      center: [43.6532, -79.3832],
      zoom: 11,
      zoomControl: false,
    });

    // Sleek dark-mode maps to match the brand aesthetic
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20,
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers and route geometry when coordinates change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers and paths
    if (markersRef.current.pickup) {
      markersRef.current.pickup.remove();
      delete markersRef.current.pickup;
    }
    if (markersRef.current.dropoff) {
      markersRef.current.dropoff.remove();
      delete markersRef.current.dropoff;
    }
    if (routeRef.current) {
      routeRef.current.remove();
      routeRef.current = null;
    }
    setRouteInfo(null);

    const bounds: L.LatLngExpression[] = [];

    // Create Pickup Marker (A)
    if (pickupCoords) {
      const pickupIcon = L.divIcon({
        html: `
          <div class="flex items-center justify-center w-8 h-8 rounded-full bg-[#0a0a0a] border-2 border-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.7)] text-[#d4af37] font-sans font-bold text-xs select-none">
            A
          </div>
        `,
        className: "custom-map-marker-pickup",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const pickupMarker = L.marker([pickupCoords.lat, pickupCoords.lon], { icon: pickupIcon }).addTo(map);
      pickupMarker.bindPopup('<b style="color: #d4af37; font-family: serif;">Pickup Location</b>');
      markersRef.current.pickup = pickupMarker;
      bounds.push([pickupCoords.lat, pickupCoords.lon]);
    }

    // Create Drop-off Marker (B)
    if (dropoffCoords) {
      const dropoffIcon = L.divIcon({
        html: `
          <div class="flex items-center justify-center w-8 h-8 rounded-full bg-[#0a0a0a] border-2 border-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.7)] text-[#d4af37] font-sans font-bold text-xs select-none">
            B
          </div>
        `,
        className: "custom-map-marker-dropoff",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const dropoffMarker = L.marker([dropoffCoords.lat, dropoffCoords.lon], { icon: dropoffIcon }).addTo(map);
      dropoffMarker.bindPopup('<b style="color: #d4af37; font-family: serif;">Drop-off Location</b>');
      markersRef.current.dropoff = dropoffMarker;
      bounds.push([dropoffCoords.lat, dropoffCoords.lon]);
    }

    // Render Route line if both points are defined
    if (pickupCoords && dropoffCoords) {
      const fetchDrivingRoute = async () => {
        try {
          const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${pickupCoords.lon},${pickupCoords.lat};${dropoffCoords.lon},${dropoffCoords.lat}?overview=full&geometries=geojson`
          );
          if (response.ok) {
            const data = await response.json();
            if (data.routes && data.routes.length > 0) {
              const route = data.routes[0];
              const coordinates = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]] as [number, number]);

              // Sleek dashed gold line to trace the route
              const polyline = L.polyline(coordinates, {
                color: "#d4af37",
                weight: 4,
                opacity: 0.85,
                dashArray: "4, 8",
                lineJoin: "round",
              }).addTo(map);

              routeRef.current = polyline;

              const distanceKm = (route.distance / 1000).toFixed(1);
              const durationMin = Math.round(route.duration / 60);

              setRouteInfo({
                distance: `${distanceKm} km`,
                duration: `${durationMin} mins`,
              });

              // Smoothly fit map boundary to route
              map.fitBounds(polyline.getBounds(), { padding: [50, 50], animate: true, duration: 1 });
              return;
            }
          }
          throw new Error("Failed to load OSRM geometry");
        } catch (error) {
          console.warn("OSRM routing offline, drawing standard line instead:", error);

          // Fallback to drawing a straight line
          const polyline = L.polyline(
            [
              [pickupCoords.lat, pickupCoords.lon],
              [dropoffCoords.lat, dropoffCoords.lon],
            ],
            {
              color: "#d4af37",
              weight: 4,
              opacity: 0.8,
              dashArray: "6, 8",
            }
          ).addTo(map);

          routeRef.current = polyline;

          // Haversine calculation for straight-line distance
          const R = 6371; // Earth radius in km
          const dLat = ((dropoffCoords.lat - pickupCoords.lat) * Math.PI) / 180;
          const dLon = ((dropoffCoords.lon - pickupCoords.lon) * Math.PI) / 180;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((pickupCoords.lat * Math.PI) / 180) *
              Math.cos((dropoffCoords.lat * Math.PI) / 180) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = (R * c).toFixed(1);
          const duration = Math.round((parseFloat(distance) / 50) * 60); // assume average 50 km/h

          setRouteInfo({
            distance: `${distance} km`,
            duration: `${duration} mins`,
          });

          map.fitBounds(polyline.getBounds(), { padding: [50, 50], animate: true, duration: 1 });
        }
      };

      fetchDrivingRoute();
    } else if (bounds.length > 0) {
      // Centering map to the single active marker
      map.setView(bounds[0], 13, { animate: true, duration: 0.8 });
    }
  }, [pickupCoords, dropoffCoords]);

  return (
    <div className="relative w-full h-80 rounded-lg overflow-hidden border border-[#d4af37]/15">
      <div ref={mapContainerRef} className="w-full h-full bg-[#0a0a0a]" />

      {routeInfo && (
        <div className="absolute top-4 left-4 z-[1000] glass-panel px-4 py-3 rounded-md border border-[#d4af37]/35 text-white flex flex-col gap-1 shadow-lg pointer-events-none transition-all duration-300">
          <div className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">
            Route Details
          </div>
          <div className="flex gap-4 items-center">
            <div>
              <span className="text-gray-400 text-xs">Distance:</span>{" "}
              <span className="text-sm font-semibold font-mono text-white">{routeInfo.distance}</span>
            </div>
            <div className="w-1 h-1 bg-[#d4af37]/40 rounded-full" />
            <div>
              <span className="text-gray-400 text-xs">Est. Time:</span>{" "}
              <span className="text-sm font-semibold font-mono text-white">{routeInfo.duration}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
