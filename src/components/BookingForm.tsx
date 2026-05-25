"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Users, Car, ArrowRight } from "lucide-react";

export const vehicleCategories = [
  "Rolls Royce Phantom",
  "Mercedes-Benz S-Class",
  "Cadillac Escalade ESV",
  "Bentley Flying Spur",
  "Super Stretch Limousine",
  "Luxury Executive SUV",
];

export default function BookingForm({ horizontal = false }: { horizontal?: boolean }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    pickup: "",
    dropoff: "",
    dateTime: "",
    vehicle: vehicleCategories[0],
    passengers: "1",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, we would submit this to an API or state manager
    // Redirect to contact or booking success
    const query = new URLSearchParams(formData).toString();
    router.push(`/booking?${query}`);
  };

  const inputStyles = "w-full bg-matte-black border border-luxury-gold/15 focus:border-luxury-gold/50 text-white placeholder-gray-500 rounded-md py-3 pl-10 pr-4 text-sm outline-none transition-all duration-300";
  const labelStyles = "block text-xs uppercase tracking-widest text-luxury-gold font-medium mb-2";

  if (horizontal) {
    return (
      <form
        onSubmit={handleSubmit}
        className="glass-panel p-6 md:p-8 rounded-lg border border-luxury-gold/20 shadow-2xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end"
      >
        <div className="relative">
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
            />
          </div>
        </div>

        <div className="relative">
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
            />
          </div>
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
              className={`${inputStyles} cursor-pointer [color-scheme:dark]`}
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
                {vehicleCategories.map((vehicle) => (
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
      <div className="relative">
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
          />
        </div>
      </div>

      <div className="relative">
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
          />
        </div>
      </div>

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
              className={`${inputStyles} cursor-pointer [color-scheme:dark]`}
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
                {vehicleCategories.map((vehicle) => (
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
        className="w-full bg-gradient-to-r from-luxury-gold to-soft-gold hover:from-soft-gold hover:to-luxury-gold text-matte-black font-semibold text-xs uppercase tracking-widest py-4 rounded-md transition-all duration-300 flex items-center justify-center gap-2 group shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)]"
      >
        <span>Request Chauffeur Reservation</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </form>
  );
}
