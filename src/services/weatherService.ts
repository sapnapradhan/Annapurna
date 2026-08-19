export interface WeatherData {
  locationName: string;
  currentTemp: number; // °C
  condition: string;
  iconType: 'sunny' | 'partly_cloudy' | 'cloudy' | 'rain' | 'storm' | 'fog' | 'clear_night';
  feelsLike: number;
  high: number;
  low: number;
  humidity: number; // %
  windSpeed: number; // km/h
  precipitationProb: number; // %
  dailyForecast: Array<{
    day: string;
    condition: string;
    iconType: 'sunny' | 'partly_cloudy' | 'cloudy' | 'rain' | 'storm' | 'fog' | 'clear_night';
    high: number;
    low: number;
    rainProb: number;
  }>;
}

const DEFAULT_WEATHER: WeatherData = {
  locationName: 'Bhubaneswar, Odisha',
  currentTemp: 29,
  condition: 'Partly Cloudy',
  iconType: 'partly_cloudy',
  feelsLike: 31,
  high: 33,
  low: 25,
  humidity: 68,
  windSpeed: 14,
  precipitationProb: 20,
  dailyForecast: [
    { day: 'Mon', condition: 'Sunny', iconType: 'sunny', high: 32, low: 23, rainProb: 10 },
    { day: 'Tue', condition: 'Partly Cloudy', iconType: 'partly_cloudy', high: 31, low: 24, rainProb: 20 },
    { day: 'Wed', condition: 'Scattered Rain', iconType: 'rain', high: 29, low: 22, rainProb: 65 },
    { day: 'Thu', condition: 'Thunderstorm', iconType: 'storm', high: 27, low: 21, rainProb: 80 },
    { day: 'Fri', condition: 'Cloudy', iconType: 'cloudy', high: 30, low: 23, rainProb: 30 },
    { day: 'Sat', condition: 'Sunny', iconType: 'sunny', high: 33, low: 24, rainProb: 5 },
    { day: 'Sun', condition: 'Clear', iconType: 'sunny', high: 34, low: 25, rainProb: 0 },
  ]
};

class WeatherService {
  private cache: Map<string, { data: WeatherData; timestamp: number }> = new Map();

  public async getWeatherForLocation(lat: number, lon: number, locationName: string): Promise<WeatherData> {
    const key = `${lat.toFixed(2)},${lon.toFixed(2)}`;
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < 10 * 60 * 1000) { // 10 min cache
      return cached.data;
    }

    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
      );
      if (!res.ok) throw new Error('Weather API error');

      const data = await res.json();
      const current = data.current;
      const daily = data.daily;

      const weatherData: WeatherData = {
        locationName,
        currentTemp: Math.round(current.temperature_2m),
        condition: this.getWeatherConditionText(current.weather_code),
        iconType: this.getWeatherIconType(current.weather_code),
        feelsLike: Math.round(current.apparent_temperature),
        high: Math.round(daily.temperature_2m_max[0]),
        low: Math.round(daily.temperature_2m_min[0]),
        humidity: Math.round(current.relative_humidity_2m),
        windSpeed: Math.round(current.wind_speed_10m),
        precipitationProb: Math.round(daily.precipitation_probability_max[0] || 0),
        dailyForecast: daily.time.slice(0, 7).map((t: string, idx: number) => {
          const date = new Date(t);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          const code = daily.weather_code[idx];
          return {
            day: dayName,
            condition: this.getWeatherConditionText(code),
            iconType: this.getWeatherIconType(code),
            high: Math.round(daily.temperature_2m_max[idx]),
            low: Math.round(daily.temperature_2m_min[idx]),
            rainProb: Math.round(daily.precipitation_probability_max[idx] || 0),
          };
        })
      };

      this.cache.set(key, { data: weatherData, timestamp: Date.now() });
      return weatherData;
    } catch (e) {
      console.warn('Using fallback weather data:', e);
      return { ...DEFAULT_WEATHER, locationName };
    }
  }

  public async searchCity(query: string): Promise<Array<{ name: string; country: string; lat: number; lon: number }>> {
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
      if (!res.ok) return [];
      const data = await res.json();
      if (!data.results) return [];
      return data.results.map((r: any) => ({
        name: `${r.name}${r.admin1 ? `, ${r.admin1}` : ''}`,
        country: r.country,
        lat: r.latitude,
        lon: r.longitude
      }));
    } catch (e) {
      return [];
    }
  }

  private getWeatherConditionText(code: number): string {
    if (code === 0) return 'Sunny / Clear';
    if (code <= 3) return 'Partly Cloudy';
    if (code <= 48) return 'Foggy';
    if (code <= 67) return 'Rainy';
    if (code <= 77) return 'Snow';
    if (code <= 82) return 'Heavy Rain';
    if (code <= 99) return 'Thunderstorm';
    return 'Clear';
  }

  private getWeatherIconType(code: number): WeatherData['iconType'] {
    if (code === 0) return 'sunny';
    if (code <= 3) return 'partly_cloudy';
    if (code <= 48) return 'fog';
    if (code <= 67) return 'rain';
    if (code <= 82) return 'rain';
    if (code <= 99) return 'storm';
    return 'partly_cloudy';
  }
}

export const weatherService = new WeatherService();
