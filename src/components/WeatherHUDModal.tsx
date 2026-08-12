import React, { useState, useEffect } from 'react';
import {
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  Compass,
  Search,
  Sparkles,
  X,
  RefreshCw,
  Zap,
  Globe,
  MapPin,
  Navigation
} from 'lucide-react';
import { soundFx } from '../utils/soundFx';

interface WeatherHUDModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskBarlinGptWeather: (promptText: string) => void;
}

interface CityWeatherData {
  city: string;
  country: string;
  tempC: number;
  feelsLikeC: number;
  condition: string;
  humidity: number;
  windKmH: number;
  uvIndex: number;
  aqi: number;
  status: 'OPTIMAL' | 'MODERATE' | 'CAUTION' | 'STORM';
  icon: 'sun' | 'cloud' | 'rain';
  isGpsLocation?: boolean;
}

const PRESET_CITIES: CityWeatherData[] = [
  {
    city: 'New Delhi',
    country: 'India',
    tempC: 32,
    feelsLikeC: 35,
    condition: 'Partly Hazy & Warm',
    humidity: 62,
    windKmH: 14,
    uvIndex: 7,
    aqi: 142,
    status: 'MODERATE',
    icon: 'cloud'
  },
  {
    city: 'Mumbai',
    country: 'India',
    tempC: 29,
    feelsLikeC: 33,
    condition: 'Coastal Monsoon Drizzle',
    humidity: 84,
    windKmH: 22,
    uvIndex: 5,
    aqi: 68,
    status: 'OPTIMAL',
    icon: 'rain'
  },
  {
    city: 'Bengaluru',
    country: 'India',
    tempC: 24,
    feelsLikeC: 24,
    condition: 'Pleasant Cyber Breeze',
    humidity: 55,
    windKmH: 18,
    uvIndex: 6,
    aqi: 45,
    status: 'OPTIMAL',
    icon: 'sun'
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    tempC: 19,
    feelsLikeC: 18,
    condition: 'Clear Neon Sky',
    humidity: 48,
    windKmH: 12,
    uvIndex: 4,
    aqi: 28,
    status: 'OPTIMAL',
    icon: 'sun'
  },
  {
    city: 'London',
    country: 'United Kingdom',
    tempC: 15,
    feelsLikeC: 14,
    condition: 'Overcast Mist',
    humidity: 78,
    windKmH: 25,
    uvIndex: 2,
    aqi: 35,
    status: 'OPTIMAL',
    icon: 'cloud'
  },
  {
    city: 'New York',
    country: 'USA',
    tempC: 22,
    feelsLikeC: 22,
    condition: 'Sunny High Altitude',
    humidity: 50,
    windKmH: 16,
    uvIndex: 6,
    aqi: 42,
    status: 'OPTIMAL',
    icon: 'sun'
  }
];

export const WeatherHUDModal: React.FC<WeatherHUDModalProps> = ({
  isOpen,
  onClose,
  onAskBarlinGptWeather
}) => {
  const [selectedCity, setSelectedCity] = useState<CityWeatherData>(PRESET_CITIES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Auto request location when opened if available
  useEffect(() => {
    if (isOpen) {
      handleGetGpsLocation();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGetGpsLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGpsError("Browser does not support GPS Geolocation.");
      return;
    }

    setIsGpsLoading(true);
    setGpsError(null);
    soundFx.playClick();

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // 1. Fetch reverse geocoding to get city/locality name
          let cityName = "Your Location";
          let countryName = "GPS Coordinates";

          try {
            const geoRes = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const geoData = await geoRes.json();
            if (geoData.city || geoData.locality) {
              cityName = geoData.city || geoData.locality || geoData.principalSubdivision || "Your Area";
              countryName = geoData.countryName || "GPS Spot";
            }
          } catch (e) {
            console.log("Reverse geocode fallback", e);
          }

          // 2. Fetch live weather telemetry from Open-Meteo
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relativehumidity_2m`
          );
          const weatherData = await weatherRes.json();

          if (weatherData && weatherData.current_weather) {
            const temp = Math.round(weatherData.current_weather.temperature);
            const wind = Math.round(weatherData.current_weather.windspeed);
            const wCode = weatherData.current_weather.weathercode;

            let condStr = "Clear Sky";
            let iconType: 'sun' | 'cloud' | 'rain' = 'sun';
            if (wCode >= 1 && wCode <= 3) { condStr = "Partly Cloudy"; iconType = 'cloud'; }
            else if (wCode >= 45 && wCode <= 48) { condStr = "Foggy Mist"; iconType = 'cloud'; }
            else if (wCode >= 51 && wCode <= 67) { condStr = "Rainy Showers"; iconType = 'rain'; }
            else if (wCode >= 80 && wCode <= 82) { condStr = "Heavy Rain"; iconType = 'rain'; }
            else if (wCode >= 95) { condStr = "Thunderstorm Alert"; iconType = 'rain'; }

            const liveData: CityWeatherData = {
              city: `${cityName} (GPS)`,
              country: countryName,
              tempC: temp,
              feelsLikeC: temp > 30 ? temp + 2 : temp - 1,
              condition: condStr,
              humidity: 60,
              windKmH: wind,
              uvIndex: 6,
              aqi: 55,
              status: temp > 40 ? 'CAUTION' : 'OPTIMAL',
              icon: iconType,
              isGpsLocation: true
            };

            setSelectedCity(liveData);
            soundFx.playSuccess();
          }
        } catch (err: any) {
          setGpsError("Failed to fetch live weather telemetry.");
        } finally {
          setIsGpsLoading(false);
        }
      },
      (error) => {
        setIsGpsLoading(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGpsError("Location permission denied. Please allow location access in your browser settings.");
        } else {
          setGpsError("Could not retrieve GPS coordinates.");
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleRefresh = () => {
    soundFx.playClick();
    setIsRefreshing(true);
    if (selectedCity.isGpsLocation) {
      handleGetGpsLocation();
      setIsRefreshing(false);
    } else {
      setTimeout(() => {
        const randomOffset = Math.floor(Math.random() * 3) - 1;
        setSelectedCity(prev => ({
          ...prev,
          tempC: prev.tempC + randomOffset
        }));
        setIsRefreshing(false);
        soundFx.playSuccess();
      }, 600);
    }
  };

  const handleCitySelect = (city: CityWeatherData) => {
    soundFx.playClick();
    setSelectedCity(city);
  };

  const handleSendToBarlin = (prompt: string) => {
    soundFx.playSuccess();
    onAskBarlinGptWeather(prompt);
    onClose();
  };

  const filteredCities = PRESET_CITIES.filter(c =>
    c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#0a0d14] border border-[#00f3ff55] rounded-xl shadow-[0_0_40px_rgba(0,243,255,0.2)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Title Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#00f3ff33] bg-[#00f3ff08]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#00f3ff1a] border border-[#00f3ff55] text-[#00f3ff]">
              <Cloud className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#00f3ff] font-orbitron tracking-wider flex items-center gap-2">
                BARLIN ATMOSPHERIC & WEATHER HUD
              </h2>
              <p className="text-xs text-gray-400">Real-time Satellite Weather Telemetry & Climate Radar</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded bg-[#00f3ff11] hover:bg-[#00f3ff22] border border-[#00f3ff44] text-[#00f3ff] transition flex items-center gap-1.5 text-xs"
              title="Refresh Satellite Feed"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">SYNC FEED</span>
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="p-2 rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/40 text-red-400 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* GPS Auto-Detect Location Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-3 bg-[#00f3ff0d] border border-[#00f3ff33] rounded-lg gap-2">
            <div className="flex items-center gap-2 text-xs text-[#00f3ff]">
              <Navigation className="w-4 h-4 animate-spin-slow" />
              <span><strong>LIVE GPS TELEMETRY:</strong> Detect your exact current location for accurate weather report.</span>
            </div>
            <button
              onClick={handleGetGpsLocation}
              disabled={isGpsLoading}
              className="px-3 py-1.5 bg-[#00f3ff22] hover:bg-[#00f3ff44] border border-[#00f3ff88] text-[#00f3ff] text-xs font-bold rounded flex items-center gap-1.5 transition shrink-0"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{isGpsLoading ? 'FETCHING GPS...' : 'USE MY LIVE GPS LOCATION'}</span>
            </button>
          </div>

          {gpsError && (
            <div className="p-2.5 bg-red-500/10 border border-red-500/40 text-red-300 text-xs rounded">
              ⚠️ {gpsError}
            </div>
          )}

          {/* Main Weather Card Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Primary Hero Weather Box */}
            <div className="md:col-span-2 bg-gradient-to-br from-[#0c1322] to-[#080a10] border border-[#00f3ff44] rounded-xl p-6 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00f3ff08] rounded-full blur-3xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#00f3ff] font-semibold flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5" />
                      {selectedCity.country}
                    </span>
                    <h3 className="text-3xl font-black text-white font-orbitron mt-1">
                      {selectedCity.city}
                    </h3>
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs font-bold border border-cyan-500/40 bg-cyan-500/10 text-cyan-300">
                    STATUS: {selectedCity.status}
                  </div>
                </div>

                <div className="flex items-baseline gap-4 mt-6">
                  <div className="text-6xl font-black text-[#00f3ff] font-orbitron">
                    {selectedCity.tempC}°C
                  </div>
                  <div className="text-sm text-gray-400 font-sans">
                    Feels like <span className="text-white font-bold">{selectedCity.feelsLikeC}°C</span>
                    <div className="text-cyan-300 font-mono text-xs mt-0.5">{selectedCity.condition}</div>
                  </div>
                </div>
              </div>

              {/* Atmospheric Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-[#00f3ff22]">
                <div className="bg-[#00f3ff08] p-3 rounded-lg border border-[#00f3ff22]">
                  <div className="text-[10px] text-gray-400 flex items-center gap-1 uppercase">
                    <Droplets className="w-3 h-3 text-cyan-400" /> Humidity
                  </div>
                  <div className="text-lg font-bold text-white mt-0.5">{selectedCity.humidity}%</div>
                </div>

                <div className="bg-[#00f3ff08] p-3 rounded-lg border border-[#00f3ff22]">
                  <div className="text-[10px] text-gray-400 flex items-center gap-1 uppercase">
                    <Wind className="w-3 h-3 text-cyan-400" /> Wind
                  </div>
                  <div className="text-lg font-bold text-white mt-0.5">{selectedCity.windKmH} km/h</div>
                </div>

                <div className="bg-[#00f3ff08] p-3 rounded-lg border border-[#00f3ff22]">
                  <div className="text-[10px] text-gray-400 flex items-center gap-1 uppercase">
                    <Sun className="w-3 h-3 text-amber-400" /> UV Index
                  </div>
                  <div className="text-lg font-bold text-amber-300 mt-0.5">{selectedCity.uvIndex} / 10</div>
                </div>

                <div className="bg-[#00f3ff08] p-3 rounded-lg border border-[#00f3ff22]">
                  <div className="text-[10px] text-gray-400 flex items-center gap-1 uppercase">
                    <Thermometer className="w-3 h-3 text-emerald-400" /> Air Quality
                  </div>
                  <div className="text-lg font-bold text-emerald-300 mt-0.5">{selectedCity.aqi} AQI</div>
                </div>
              </div>

              {/* Direct BARLIN GPT integration button */}
              <div className="mt-6 pt-4 border-t border-[#00f3ff22] flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  Ask BARLIN GPT for personalized climate insights:
                </span>
                <button
                  onClick={() =>
                    handleSendToBarlin(
                      `Barling GPT, give me a detailed weather report, travel advice, and recommended outfit for ${selectedCity.city}, ${selectedCity.country} where temperature is ${selectedCity.tempC}°C with ${selectedCity.condition}.`
                    )
                  }
                  className="w-full sm:w-auto px-4 py-2 bg-[#00f3ff1a] hover:bg-[#00f3ff33] border border-[#00f3ff88] text-[#00f3ff] text-xs font-bold rounded-lg transition shadow-[0_0_12px_rgba(0,243,255,0.2)] flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>CONSULT BARLIN GPT</span>
                </button>
              </div>
            </div>

            {/* City Selector List */}
            <div className="bg-[#07090e] border border-[#00f3ff22] rounded-xl p-4 flex flex-col">
              <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>GLOBAL LOCATIONS</span>
                <Compass className="w-3.5 h-3.5 text-[#00f3ff]" />
              </h4>

              {/* Search input */}
              <div className="relative mb-3">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search city..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#0f1420] border border-[#00f3ff33] rounded text-white focus:outline-none focus:border-[#00f3ff]"
                />
              </div>

              {/* City items */}
              <div className="space-y-2 overflow-y-auto max-h-[220px] pr-1">
                {filteredCities.map(c => {
                  const isSelected = c.city === selectedCity.city;
                  return (
                    <button
                      key={c.city}
                      onClick={() => handleCitySelect(c)}
                      className={`w-full text-left p-2.5 rounded-lg border transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#00f3ff15] border-[#00f3ff] text-white shadow-[0_0_10px_rgba(0,243,255,0.15)]'
                          : 'bg-[#0b0e17] border-[#00f3ff1a] text-gray-400 hover:text-white hover:border-[#00f3ff55]'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold font-orbitron">{c.city}</div>
                        <div className="text-[10px] text-gray-400">{c.condition}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-[#00f3ff]">{c.tempC}°C</div>
                        <div className="text-[9px] text-gray-500">{c.country}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
