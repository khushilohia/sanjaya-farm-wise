import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { fetchWeather, type WeatherData } from "../api/openmeteo";

// Gangtok, Sikkim fallback
const DEFAULT_LAT = 27.33;
const DEFAULT_LON = 88.62;

export function useGeolocation() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported");
      setLocationLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setLocationLoading(false);
      },
      () => {
        // Permission denied or unavailable — use defaults silently
        setCoords({ lat: DEFAULT_LAT, lon: DEFAULT_LON });
        setLocationError("Using default location (Gangtok)");
        setLocationLoading(false);
      },
      { timeout: 8000, maximumAge: 1000 * 60 * 10 },
    );
  }, []);

  return { coords, locationError, locationLoading };
}

export function useWeather() {
  const { coords, locationError, locationLoading } = useGeolocation();

  const lat = coords?.lat ?? DEFAULT_LAT;
  const lon = coords?.lon ?? DEFAULT_LON;

  const query = useQuery<WeatherData>({
    queryKey: ["weather", lat, lon],
    queryFn: () => fetchWeather(lat, lon),
    staleTime: 1000 * 60 * 30,
    enabled: !locationLoading,
  });

  return { ...query, locationError, locationLoading };
}
