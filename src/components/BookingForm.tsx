"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPin, Calendar, Users, Car, ArrowRight, User, Mail, Phone } from "lucide-react";
import dynamic from "next/dynamic";

const BookingMap = dynamic(() => import("./BookingMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 bg-matte-black/50 border border-luxury-gold/10 rounded-lg animate-pulse flex items-center justify-center">
      <span className="text-xs uppercase tracking-widest text-luxury-gold">Loading Map Display...</span>
    </div>
  ),
});

export const vehicleCategories = [
  "Rolls-Royce Phantom VIII",
  "Mercedes-Benz S-Class (W223)",
  "Bentley Flying Spur",
  "Cadillac Escalade ESV",
  "Super Stretch Limousine",
  "VIP Executive Sprinter",
];

function BookingFormInner({ horizontal = false }: { horizontal?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [vehicles, setVehicles] = useState<string[]>(vehicleCategories);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pickup: "",
    dropoff: "",
    dateTime: "",
    vehicle: vehicleCategories[0],
    passengers: "1",
  });

  // Map coordinates states
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<{ lat: number; lon: number } | null>(null);

  // Autocomplete suggestions states
  const [pickupSuggestions, setPickupSuggestions] = useState<any[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<any[]>([]);
  const [lastSelectedPickup, setLastSelectedPickup] = useState("");
  const [lastSelectedDropoff, setLastSelectedDropoff] = useState("");

  // Fetch suggestions from OpenStreetMap Nominatim
  const fetchSuggestions = async (query: string, type: "pickup" | "dropoff") => {
    if (!query || query.trim().length < 3) {
      if (type === "pickup") setPickupSuggestions([]);
      else setDropoffSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      if (response.ok) {
        const data = await response.json();
        if (type === "pickup") {
          setPickupSuggestions(data);
        } else {
          setDropoffSuggestions(data);
        }
      }
    } catch (error) {
      console.error("Geocoding autocomplete error:", error);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setPickupSuggestions([]);
      setDropoffSuggestions([]);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // Debounce autocomplete suggestions
  useEffect(() => {
    if (!formData.pickup || formData.pickup.trim() === "") {
      setPickupCoords(null);
      setLastSelectedPickup("");
      setPickupSuggestions([]);
      return;
    }
    if (formData.pickup === lastSelectedPickup) {
      setPickupSuggestions([]);
      return;
    }
    const timeout = setTimeout(() => {
      fetchSuggestions(formData.pickup, "pickup");
    }, 400);
    return () => clearTimeout(timeout);
  }, [formData.pickup, lastSelectedPickup]);

  useEffect(() => {
    if (!formData.dropoff || formData.dropoff.trim() === "") {
      setDropoffCoords(null);
      setLastSelectedDropoff("");
      setDropoffSuggestions([]);
      return;
    }
    if (formData.dropoff === lastSelectedDropoff) {
      setDropoffSuggestions([]);
      return;
    }
    const timeout = setTimeout(() => {
      fetchSuggestions(formData.dropoff, "dropoff");
    }, 400);
    return () => clearTimeout(timeout);
  }, [formData.dropoff, lastSelectedDropoff]);

  // Fetch active fleet from API to populate vehicle dropdown dynamically
  useEffect(() => {
    async function fetchFleet() {
      try {
        const response = await fetch("/api/fleet");
        if (response.ok) {
          const data = await response.json();
          const activeVehicles = data
            .filter((car: any) => car.available !== false)
            .map((car: any) => car.name);
          
          if (activeVehicles.length > 0) {
            setVehicles(activeVehicles);
            // Update default vehicle if current one isn't in the fetched list
            setFormData((prev) => ({
              ...prev,
              vehicle: prev.vehicle || activeVehicles[0],
            }));
          }
        }
      } catch (error) {
        console.error("Failed to load fleet for booking dropdown:", error);
      }
    }
    fetchFleet();
  }, []);

  // Pre-fill form from URL search parameters on load
  useEffect(() => {
    const pickup = searchParams.get("pickup") || "";
    const dropoff = searchParams.get("dropoff") || "";
    const dateTime = searchParams.get("dateTime") || "";
    const vehicle = searchParams.get("vehicle") || vehicles[0];
    const passengers = searchParams.get("passengers") || "1";

    setFormData((prev) => ({
      ...prev,
      pickup: pickup || prev.pickup,
      dropoff: dropoff || prev.dropoff,
      dateTime: dateTime || prev.dateTime,
      vehicle: vehicle || prev.vehicle,
      passengers: passengers || prev.passengers,
    }));

    // Geocode URL coordinates immediately on load
    const geocodeInitialAddress = async (address: string, type: "pickup" | "dropoff") => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
        );
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            const loc = { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
            if (type === "pickup") {
              setPickupCoords(loc);
              setLastSelectedPickup(address);
            } else {
              setDropoffCoords(loc);
              setLastSelectedDropoff(address);
            }
          }
        }
      } catch (err) {
        console.error(`Failed to geocode initial ${type} location:`, err);
      }
    };

    if (pickup) geocodeInitialAddress(pickup, "pickup");
    if (dropoff) geocodeInitialAddress(dropoff, "dropoff");
  }, [searchParams, vehicles]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (horizontal) {
      // If horizontal (homepage search bar), redirect to full booking page with parameters
      const query = new URLSearchParams({
        pickup: formData.pickup,
        dropoff: formData.dropoff,
        dateTime: formData.dateTime,
        vehicle: formData.vehicle,
        passengers: formData.passengers,
      }).toString();
      router.push(`/booking?${query}`);
    } else {
      // If full form (on booking page), post to bookings API to persist
      setSubmitting(true);
      try {
        const response = await fetch("/api/bookings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const result = await response.json();
          // Redirect to success view with dynamic reference ID
          const query = new URLSearchParams({
            submitted: "true",
            ref: result.id,
            pickup: result.pickup,
            dropoff: result.dropoff,
            dateTime: result.dateTime,
            vehicle: result.vehicle,
            passengers: result.passengers,
          }).toString();
          router.push(`/booking?${query}`);
        } else {
          const err = await response.json();
          alert(`Error: ${err.error || "Failed to create booking"}`);
        }
      } catch (error) {
        console.error("Booking submission error:", error);
        alert("Concierge system offline. Please try booking again or contact us directly.");
      } finally {
        setSubmitting(false);
      }
    }
  };

  const inputStyles = "w-full bg-matte-black border border-luxury-gold/15 focus:border-luxury-gold/50 text-white placeholder-gray-500 rounded-md py-3 pl-10 pr-4 text-sm outline-none transition-all duration-300";
  const labelStyles = "block text-xs uppercase tracking-widest text-luxury-gold font-medium mb-2";

  if (horizontal) {
    return (
      <form
        onSubmit={handleSubmit}
        className="glass-panel p-6 md:p-8 rounded-lg border border-luxury-gold/20 shadow-2xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end"
      >
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <label className={labelStyles}>Pickup Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-gold" />
            <input
              type="text"
              name="pickup"
              value={formData.pickup}
              onChange={handleChange}
              placeholder="Airport, Hotel, Address"
              className={inputStyles}
              required
              autoComplete="off"
            />
          </div>
          {pickupSuggestions.length > 0 && formData.pickup !== lastSelectedPickup && (
            <div className="absolute left-0 right-0 mt-1 bg-matte-black/95 border border-luxury-gold/25 rounded-md shadow-2xl z-50 max-h-60 overflow-y-auto divide-y divide-luxury-gold/10 backdrop-blur-md">
              {pickupSuggestions.map((suggestion: any) => (
                <button
                  key={suggestion.place_id}
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, pickup: suggestion.display_name }));
                    setPickupCoords({
                      lat: parseFloat(suggestion.lat),
                      lon: parseFloat(suggestion.lon),
                    });
                    setLastSelectedPickup(suggestion.display_name);
                    setPickupSuggestions([]);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-luxury-gold/10 text-xs text-gray-200 transition-colors duration-150 cursor-pointer block border-none outline-none"
                >
                  {suggestion.display_name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <label className={labelStyles}>Drop-off Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-gold" />
            <input
              type="text"
              name="dropoff"
              value={formData.dropoff}
              onChange={handleChange}
              placeholder="Destination Address"
              className={inputStyles}
              required
              autoComplete="off"
            />
          </div>
          {dropoffSuggestions.length > 0 && formData.dropoff !== lastSelectedDropoff && (
            <div className="absolute left-0 right-0 mt-1 bg-matte-black/95 border border-luxury-gold/25 rounded-md shadow-2xl z-50 max-h-60 overflow-y-auto divide-y divide-luxury-gold/10 backdrop-blur-md">
              {dropoffSuggestions.map((suggestion: any) => (
                <button
                  key={suggestion.place_id}
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, dropoff: suggestion.display_name }));
                    setDropoffCoords({
                      lat: parseFloat(suggestion.lat),
                      lon: parseFloat(suggestion.lon),
                    });
                    setLastSelectedDropoff(suggestion.display_name);
                    setDropoffSuggestions([]);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-luxury-gold/10 text-xs text-gray-200 transition-colors duration-150 cursor-pointer block border-none outline-none"
                >
                  {suggestion.display_name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <label className={labelStyles}>Date & Time</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-gold" />
            <input
              type="datetime-local"
              name="dateTime"
              value={formData.dateTime}
              onChange={handleChange}
              className={`${inputStyles} cursor-pointer [color-scheme:light]`}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <label className={labelStyles}>Vehicle</label>
            <div className="relative">
              <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-gold" />
              <select
                name="vehicle"
                value={formData.vehicle}
                onChange={handleChange}
                className={`${inputStyles} pl-10 pr-2 appearance-none cursor-pointer`}
              >
                {vehicles.map((vehicle) => (
                  <option key={vehicle} value={vehicle}>
                    {vehicle.split(" ")[0]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="relative">
            <label className={labelStyles}>Guests</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-gold" />
              <select
                name="passengers"
                value={formData.passengers}
                onChange={handleChange}
                className={`${inputStyles} pl-10 pr-2 appearance-none cursor-pointer`}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, "9+"].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-luxury-gold to-soft-gold hover:from-soft-gold hover:to-luxury-gold text-matte-black font-semibold text-xs uppercase tracking-widest py-3.5 px-4 rounded-md transition-all duration-300 flex items-center justify-center gap-2 group shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)]"
          >
            <span>Book Ride</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel p-8 rounded-lg border border-luxury-gold/20 shadow-2xl w-full flex flex-col gap-6"
    >
      {/* Contact Details (Name, Email, Phone) */}
      <div className="border-b border-luxury-gold/10 pb-6 mb-2">
        <h3 className="text-sm font-serif text-luxury-gold uppercase tracking-widest font-semibold mb-4">
          Contact Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative">
            <label className={labelStyles}>Your Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-gold" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Sir / Madam Name"
                className={inputStyles}
                required
              />
            </div>
          </div>

          <div className="relative">
            <label className={labelStyles}>Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-gold" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="client@executive.com"
                className={inputStyles}
                required
              />
            </div>
          </div>

          <div className="relative">
            <label className={labelStyles}>Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-gold" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className={inputStyles}
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Ride Details */}
      <h3 className="text-sm font-serif text-luxury-gold uppercase tracking-widest font-semibold">
        Ride Parameters
      </h3>
      
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <label className={labelStyles}>Pickup Location</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-gold" />
          <input
            type="text"
            name="pickup"
            value={formData.pickup}
            onChange={handleChange}
            placeholder="Airport, Hotel, Address"
            className={inputStyles}
            required
            autoComplete="off"
          />
        </div>
        {pickupSuggestions.length > 0 && formData.pickup !== lastSelectedPickup && (
          <div className="absolute left-0 right-0 mt-1 bg-matte-black/95 border border-luxury-gold/25 rounded-md shadow-2xl z-50 max-h-60 overflow-y-auto divide-y divide-luxury-gold/10 backdrop-blur-md">
            {pickupSuggestions.map((suggestion: any) => (
              <button
                key={suggestion.place_id}
                type="button"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, pickup: suggestion.display_name }));
                  setPickupCoords({
                    lat: parseFloat(suggestion.lat),
                    lon: parseFloat(suggestion.lon),
                  });
                  setLastSelectedPickup(suggestion.display_name);
                  setPickupSuggestions([]);
                }}
                className="w-full text-left px-4 py-3 hover:bg-luxury-gold/10 text-xs md:text-sm text-gray-200 transition-colors duration-150 cursor-pointer block border-none outline-none"
              >
                {suggestion.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <label className={labelStyles}>Drop-off Location</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-gold" />
          <input
            type="text"
            name="dropoff"
            value={formData.dropoff}
            onChange={handleChange}
            placeholder="Destination Address"
            className={inputStyles}
            required
            autoComplete="off"
          />
        </div>
        {dropoffSuggestions.length > 0 && formData.dropoff !== lastSelectedDropoff && (
          <div className="absolute left-0 right-0 mt-1 bg-matte-black/95 border border-luxury-gold/25 rounded-md shadow-2xl z-50 max-h-60 overflow-y-auto divide-y divide-luxury-gold/10 backdrop-blur-md">
            {dropoffSuggestions.map((suggestion: any) => (
              <button
                key={suggestion.place_id}
                type="button"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, dropoff: suggestion.display_name }));
                  setDropoffCoords({
                    lat: parseFloat(suggestion.lat),
                    lon: parseFloat(suggestion.lon),
                  });
                  setLastSelectedDropoff(suggestion.display_name);
                  setDropoffSuggestions([]);
                }}
                className="w-full text-left px-4 py-3 hover:bg-luxury-gold/10 text-xs md:text-sm text-gray-200 transition-colors duration-150 cursor-pointer block border-none outline-none"
              >
                {suggestion.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Booking Map Preview */}
      {(pickupCoords || dropoffCoords) && (
        <div className="w-full mt-2 transition-all duration-500 ease-in-out">
          <BookingMap pickupCoords={pickupCoords} dropoffCoords={dropoffCoords} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          <label className={labelStyles}>Date & Time</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-gold" />
            <input
              type="datetime-local"
              name="dateTime"
              value={formData.dateTime}
              onChange={handleChange}
              className={`${inputStyles} cursor-pointer [color-scheme:light]`}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <label className={labelStyles}>Vehicle Selection</label>
            <div className="relative">
              <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-gold" />
              <select
                name="vehicle"
                value={formData.vehicle}
                onChange={handleChange}
                className={`${inputStyles} pl-10 pr-2 appearance-none cursor-pointer`}
              >
                {vehicles.map((vehicle) => (
                  <option key={vehicle} value={vehicle}>
                    {vehicle}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="relative">
            <label className={labelStyles}>Passengers</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-gold" />
              <select
                name="passengers"
                value={formData.passengers}
                onChange={handleChange}
                className={`${inputStyles} pl-10 pr-2 appearance-none cursor-pointer`}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, "9+"].map((num) => (
                  <option key={num} value={num}>
                    {num} Guest{num !== 1 && "s"}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-gradient-to-r from-luxury-gold to-soft-gold hover:from-soft-gold hover:to-luxury-gold text-matte-black font-semibold text-xs uppercase tracking-widest py-4 rounded-md transition-all duration-300 flex items-center justify-center gap-2 group shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <div className="w-4 h-4 border-2 border-matte-black border-t-transparent rounded-full animate-spin" />
            <span>Processing Reservation...</span>
          </>
        ) : (
          <>
            <span>Request Chauffeur Reservation</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
}

import { Suspense } from "react";

export default function BookingForm({ horizontal = false }: { horizontal?: boolean }) {
  return (
    <Suspense fallback={
      <div className="w-full bg-matte-black/50 border border-luxury-gold/10 p-6 rounded-lg animate-pulse h-[100px] flex items-center justify-center">
        <span className="text-xs uppercase tracking-widest text-luxury-gold">Loading Dispatch Form...</span>
      </div>
    }>
      <BookingFormInner horizontal={horizontal} />
    </Suspense>
  );
}
