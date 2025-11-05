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
      const API_KEY = "b89fc45c2611cd5151a9c6f6c5f8a6e4"; // OpenWeatherMap demo key
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error("City not found. Please check the spelling and try again.");
      }
      
      const data = await response.json();
      
      setWeather({
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        city: data.name,
      });
      setCity(data.name);
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
