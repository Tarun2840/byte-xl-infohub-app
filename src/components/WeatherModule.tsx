import { useState, useEffect } from "react";
import { Cloud, CloudRain, Sun, Wind, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  city: string;
}

const WeatherModule = () => {
  const [city, setCity] = useState("London");
  const [inputCity, setInputCity] = useState("London");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async (cityName: string) => {
    setIsLoading(true);
    setError("");
    
    try {
      // First, get coordinates for the city using geocoding
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
      );
      
      if (!geoResponse.ok) {
        throw new Error("Failed to find city location");
      }
      
      const geoData = await geoResponse.json();
      
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("City not found. Please check the spelling and try again.");
      }
      
      const location = geoData.results[0];
      
      // Now get weather data using coordinates
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
      );
      
      if (!weatherResponse.ok) {
        throw new Error("Failed to fetch weather data");
      }
      
      const weatherData = await weatherResponse.json();
      
      // Map weather codes to conditions
      const getCondition = (code: number): string => {
        if (code === 0) return "Clear";
        if (code <= 3) return "Cloudy";
        if (code <= 67) return "Rain";
        if (code <= 77) return "Snow";
        if (code <= 99) return "Thunderstorm";
        return "Clear";
      };
      
      setWeather({
        temperature: Math.round(weatherData.current.temperature_2m),
        condition: getCondition(weatherData.current.weather_code),
        humidity: weatherData.current.relative_humidity_2m,
        windSpeed: Math.round(weatherData.current.wind_speed_10m),
        city: location.name,
      });
      setCity(location.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather data");
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCity.trim()) {
      fetchWeather(inputCity.trim());
    }
  };

  const getWeatherIcon = () => {
    if (!weather) return <Cloud className="h-20 w-20" />;
    
    const condition = weather.condition.toLowerCase();
    if (condition.includes("rain")) return <CloudRain className="h-20 w-20 text-primary" />;
    if (condition.includes("cloud")) return <Cloud className="h-20 w-20 text-muted-foreground" />;
    return <Sun className="h-20 w-20 text-accent" />;
  };

  return (
    <Card className="border-2 shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="text-2xl">Weather Information</CardTitle>
        <CardDescription>Get real-time weather updates for any city</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter city name..."
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            Search
          </Button>
        </form>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading weather data...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-center">
            <p className="text-destructive font-medium">{error}</p>
          </div>
        )}

        {weather && !isLoading && !error && (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              {getWeatherIcon()}
              <div className="text-center space-y-2">
                <h3 className="text-3xl font-bold">{weather.city}</h3>
                <p className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {weather.temperature}°C
                </p>
                <p className="text-xl text-muted-foreground capitalize">{weather.condition}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/50 rounded-lg p-4 text-center space-y-2">
                <Wind className="h-6 w-6 mx-auto text-primary" />
                <p className="text-sm text-muted-foreground">Wind Speed</p>
                <p className="text-2xl font-bold">{weather.windSpeed} km/h</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-4 text-center space-y-2">
                <Cloud className="h-6 w-6 mx-auto text-primary" />
                <p className="text-sm text-muted-foreground">Humidity</p>
                <p className="text-2xl font-bold">{weather.humidity}%</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherModule;
