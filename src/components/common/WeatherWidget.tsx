import React, { useState, useEffect } from 'react';
import { weatherService, WeatherData } from '../../services/weatherService';
import { Sun, Cloud, CloudSun, CloudRain, CloudLightning, CloudFog, Moon, MapPin, Search, Wind, Droplets, ArrowUp, ArrowDown, Compass } from 'lucide-react';

export const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ name: string; country: string; lat: number; lon: number }>>([]);
  const [showSearch, setShowSearch] = useState(false);

  const fetchDefaultWeather = async () => {
    setLoading(true);
    // Try browser geolocation first
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const data = await weatherService.getWeatherForLocation(pos.coords.latitude, pos.coords.longitude, 'Your Location');
          setWeather(data);
          setLoading(false);
        },
        async () => {
          // Fallback to Bhubaneswar, Odisha default
          const data = await weatherService.getWeatherForLocation(20.2961, 85.8245, 'Bhubaneswar, Odisha');
          setWeather(data);
          setLoading(false);
        },
        { timeout: 5000 }
      );
    } else {
      const data = await weatherService.getWeatherForLocation(20.2961, 85.8245, 'Bhubaneswar, Odisha');
      setWeather(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDefaultWeather();
  }, []);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const results = await weatherService.searchCity(searchQuery);
    setSearchResults(results);
  };

  const handleSelectCity = async (city: { name: string; country: string; lat: number; lon: number }) => {
    setLoading(true);
    setShowSearch(false);
    setSearchResults([]);
    setSearchQuery('');
    const data = await weatherService.getWeatherForLocation(city.lat, city.lon, `${city.name}, ${city.country}`);
    setWeather(data);
    setLoading(false);
  };

  const renderWeatherIcon = (iconType: WeatherData['iconType'], className: string = 'w-6 h-6') => {
    switch (iconType) {
      case 'sunny':
        return <Sun className={`${className} text-amber-500`} />;
      case 'partly_cloudy':
        return <CloudSun className={`${className} text-amber-400`} />;
      case 'cloudy':
        return <Cloud className={`${className} text-slate-400`} />;
      case 'rain':
        return <CloudRain className={`${className} text-blue-400`} />;
      case 'storm':
        return <CloudLightning className={`${className} text-purple-400`} />;
      case 'fog':
        return <CloudFog className={`${className} text-slate-400`} />;
      case 'clear_night':
        return <Moon className={`${className} text-indigo-300`} />;
      default:
        return <Sun className={`${className} text-amber-500`} />;
    }
  };

  if (loading || !weather) {
    return (
      <div className="p-6 rounded-3xl bg-amber-900/5 dark:bg-slate-900/40 border border-amber-900/10 dark:border-slate-800 animate-pulse text-center text-xs text-amber-900/60 dark:text-slate-400">
        Loading Campus Weather Telemetry...
      </div>
    );
  }

  return (
    <div className="p-6 rounded-3xl bg-[#FDFBF7]/90 dark:bg-[#1A1715]/90 border border-[#EBE4D8] dark:border-[#2C2724] shadow-xl text-[#2C221E] dark:text-slate-100 font-sans space-y-6 backdrop-blur-md">
      {/* Header & Location Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EBE4D8] dark:border-[#2C2724] pb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#C86D44] dark:text-amber-400" />
          <span className="font-serif font-bold text-sm text-[#2C221E] dark:text-slate-100 tracking-wide">
            {weather.locationName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="px-3 py-1.5 rounded-full bg-[#F5EFE6] dark:bg-[#25201D] hover:bg-[#EBE4D8] dark:hover:bg-[#302B27] text-xs font-medium text-[#2C221E] dark:text-slate-300 border border-[#EBE4D8] dark:border-[#38322E] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-[#C86D44] dark:text-amber-400" />
            <span>Search Location</span>
          </button>
          <button
            onClick={fetchDefaultWeather}
            className="p-1.5 rounded-full bg-[#F5EFE6] dark:bg-[#25201D] hover:bg-[#EBE4D8] dark:hover:bg-[#302B27] text-slate-500 dark:text-slate-400"
            title="Use My Geolocation"
          >
            <Compass className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Manual Search Input Panel */}
      {showSearch && (
        <div className="p-4 rounded-2xl bg-[#F5EFE6] dark:bg-[#201D1A] border border-[#EBE4D8] dark:border-[#2C2724] space-y-3">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Search city (e.g., Mumbai, London, New York)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-[#FDFBF7] dark:bg-[#12100F] border border-[#EBE4D8] dark:border-[#2C2724] rounded-xl px-3 py-2 text-xs text-[#2C221E] dark:text-slate-100 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#C86D44] hover:bg-[#B35C33] text-white font-bold text-xs"
            >
              Search
            </button>
          </form>

          {searchResults.length > 0 && (
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {searchResults.map((city, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectCity(city)}
                  className="w-full p-2 rounded-lg bg-[#FDFBF7] dark:bg-[#1A1715] hover:bg-[#EBE4D8] dark:hover:bg-[#2C2724] text-left text-xs font-medium flex items-center justify-between text-[#2C221E] dark:text-slate-200"
                >
                  <span>{city.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{city.country}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Current Weather Display */}
      <div className="grid sm:grid-cols-12 gap-6 items-center">
        {/* Temp & Icon Hero */}
        <div className="sm:col-span-7 flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-[#F5EFE6] dark:bg-[#221E1B] border border-[#EBE4D8] dark:border-[#2E2824]">
            {renderWeatherIcon(weather.iconType, 'w-12 h-12')}
          </div>
          <div>
            <div className="text-4xl font-bold font-serif text-[#2C221E] dark:text-white leading-none">
              {weather.currentTemp}°C
            </div>
            <div className="text-xs font-semibold text-[#C86D44] dark:text-amber-400 mt-1 uppercase tracking-wider">
              {weather.condition}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Feels like {weather.feelsLike}°C
            </div>
          </div>
        </div>

        {/* Micro Stats Grid */}
        <div className="sm:col-span-5 grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-[#F5EFE6] dark:bg-[#201D1A] border border-[#EBE4D8] dark:border-[#2C2724]">
            <div className="text-[10px] text-slate-500 flex items-center gap-1">
              <Droplets className="w-3 h-3 text-blue-400" />
              <span>Humidity</span>
            </div>
            <div className="font-bold text-[#2C221E] dark:text-slate-200 mt-0.5">{weather.humidity}%</div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#F5EFE6] dark:bg-[#201D1A] border border-[#EBE4D8] dark:border-[#2C2724]">
            <div className="text-[10px] text-slate-500 flex items-center gap-1">
              <Wind className="w-3 h-3 text-teal-400" />
              <span>Wind</span>
            </div>
            <div className="font-bold text-[#2C221E] dark:text-slate-200 mt-0.5">{weather.windSpeed} km/h</div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#F5EFE6] dark:bg-[#201D1A] border border-[#EBE4D8] dark:border-[#2C2724]">
            <div className="text-[10px] text-slate-500 flex items-center gap-1">
              <ArrowUp className="w-3 h-3 text-amber-500" />
              <span>High / Low</span>
            </div>
            <div className="font-bold text-[#2C221E] dark:text-slate-200 mt-0.5">{weather.high}° / {weather.low}°</div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#F5EFE6] dark:bg-[#201D1A] border border-[#EBE4D8] dark:border-[#2C2724]">
            <div className="text-[10px] text-slate-500 flex items-center gap-1">
              <CloudRain className="w-3 h-3 text-blue-400" />
              <span>Precipitation</span>
            </div>
            <div className="font-bold text-[#2C221E] dark:text-slate-200 mt-0.5">{weather.precipitationProb}%</div>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast Row */}
      <div className="pt-2 border-t border-[#EBE4D8] dark:border-[#2C2724]">
        <div className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase mb-3">
          7-Day Campus Weather Forecast
        </div>

        <div className="grid grid-cols-7 gap-1.5 overflow-x-auto text-center">
          {weather.dailyForecast.map((day, idx) => (
            <div
              key={idx}
              className="p-2 rounded-xl bg-[#F5EFE6] dark:bg-[#201D1A] border border-[#EBE4D8] dark:border-[#2C2724] space-y-1 min-w-[50px]"
            >
              <div className="text-[11px] font-bold text-[#2C221E] dark:text-slate-200 font-mono">{day.day}</div>
              <div className="flex justify-center py-0.5">
                {renderWeatherIcon(day.iconType, 'w-4 h-4')}
              </div>
              <div className="text-[10px] font-mono text-[#2C221E] dark:text-slate-300 font-bold">
                {day.high}°
              </div>
              <div className="text-[9px] font-mono text-slate-500">
                {day.low}°
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
