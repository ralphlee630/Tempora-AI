
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Loader2, AlertCircle, Sparkles, Navigation } from 'lucide-react';
import { WeatherData, AppStatus } from './types';
import { fetchWeatherByCity } from './services/weatherService';
import { WeatherIcon, Wind, Droplets, Eye, Thermometer } from './components/Icons';

const App: React.FC = () => {
  const [city, setCity] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!city.trim()) return;

    setStatus(AppStatus.LOADING);
    setError(null);

    try {
      const data = await fetchWeatherByCity(city);
      setWeather(data);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Could not find that city. Please try again.');
      setStatus(AppStatus.ERROR);
    }
  };

  useEffect(() => {
    setCity('Baguio City');
    const timer = setTimeout(() => {
        const initialSearch = async () => {
          setStatus(AppStatus.LOADING);
          try {
            const data = await fetchWeatherByCity('Baguio City');
            setWeather(data);
            setStatus(AppStatus.SUCCESS);
          } catch (e) {
            setStatus(AppStatus.IDLE);
          }
        };
        initialSearch();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 w-full glass-card border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-900/50">
              <Sparkles size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Tempora AI</h1>
              <p className="text-xs text-slate-500 font-medium">Modern Weather Intelligence</p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-md relative group">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Search city (e.g. London, Tokyo)"
              className="w-full pl-11 pr-24 py-3 rounded-2xl bg-slate-900 border border-white/10 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm shadow-sm text-white placeholder-slate-600"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <button
              disabled={status === AppStatus.LOADING}
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
            >
              {status === AppStatus.LOADING ? <Loader2 size={16} className="animate-spin" /> : 'Search'}
            </button>
          </form>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 mt-8 pb-12 animate-fade-in">
        {status === AppStatus.ERROR && (
          <div className="mb-8 bg-red-900/20 border border-red-500/30 p-4 rounded-2xl flex items-center gap-3 text-red-400 shadow-sm animate-fade-in">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {status === AppStatus.LOADING ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 size={48} className="text-indigo-500 animate-spin" />
            <p className="text-slate-500 font-medium animate-pulse">Consulting the atmosphere...</p>
          </div>
        ) : weather && status === AppStatus.SUCCESS ? (
          <div className="space-y-8">
            {/* 1. HERO: Current Weather - Independent top-level section */}
            <section className="relative overflow-hidden rounded-[2.5rem] bg-indigo-600 text-white p-8 md:p-12 shadow-2xl shadow-indigo-900/30">
              <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-12 -translate-y-4">
                <WeatherIcon condition={weather.current.condition} className="w-64 h-64 text-white" />
              </div>
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={20} />
                    <h2 className="text-2xl font-bold">{weather.location}, {weather.country}</h2>
                  </div>
                  <p className="text-indigo-100 text-lg opacity-90">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                </div>

                <div className="mt-12 flex flex-col md:flex-row md:items-end gap-6">
                  <span className="text-8xl md:text-9xl font-bold tracking-tighter tabular-nums">
                    {Math.round(weather.current.temp)}°
                  </span>
                  <div className="mb-4">
                    <p className="text-3xl font-semibold capitalize">{weather.current.condition}</p>
                    <p className="text-indigo-100 mt-2">Feels like {Math.round(weather.current.feelsLike || weather.current.temp)}°</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-8 border-t border-indigo-400/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/30 rounded-xl"><Wind size={20} /></div>
                    <div>
                      <p className="text-xs text-indigo-100/70">Wind</p>
                      <p className="font-semibold">{weather.current.windSpeed} km/h</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/30 rounded-xl"><Droplets size={20} /></div>
                    <div>
                      <p className="text-xs text-indigo-100/70">Humidity</p>
                      <p className="font-semibold">{weather.current.humidity}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/30 rounded-xl"><Eye size={20} /></div>
                    <div>
                      <p className="text-xs text-indigo-100/70">Visibility</p>
                      <p className="font-semibold">{weather.current.visibility || 10} km</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/30 rounded-xl"><Thermometer size={20} /></div>
                    <div>
                      <p className="text-xs text-indigo-100/70">Condition</p>
                      <p className="font-semibold capitalize truncate max-w-[80px]">{weather.current.description || weather.current.condition}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. SECONDARY: Grid for Forecast and Advisor */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <section>
                  <h3 className="text-xl font-bold text-white mb-6 px-2 tracking-tight">5-Day Forecast</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {weather.forecast.map((day, idx) => (
                      <div key={idx} className="bg-slate-900/50 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-sm hover:border-white/20 hover:-translate-y-1 transition-all group">
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-4 text-center group-hover:text-slate-400">{day.dayName}</p>
                        <div className="flex flex-col items-center gap-3">
                          <WeatherIcon condition={day.condition} className="w-10 h-10 transition-transform group-hover:scale-110 duration-300" />
                          <div className="text-center mt-2">
                            <p className="text-xl font-bold text-white">{Math.round(day.high)}°</p>
                            <p className="text-sm font-medium text-slate-500">{Math.round(day.low)}°</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Copyright specifically below the 5 cards */}
                  <div className="mt-12 text-center lg:text-left lg:px-2">
                    <p className="text-sm font-medium text-slate-600 hover:text-slate-400 transition-colors">
                      Ralph Lee &bull; 2025
                    </p>
                  </div>
                </section>
              </div>

              <aside>
                <div className="bg-slate-900/50 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5 shadow-sm h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-amber-500/10 p-2.5 rounded-xl text-amber-500">
                      <Sparkles size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-white">AI Personal Advisor</h3>
                  </div>

                  <div className="bg-slate-950/50 rounded-2xl p-6 mb-6 flex-1 italic text-slate-400 leading-relaxed relative border border-white/5">
                    <span className="absolute -top-3 left-6 text-4xl text-slate-800">"</span>
                    <p className="relative z-10">{weather.aiAdvice}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                      <p className="text-xs font-bold text-indigo-400 uppercase mb-2">Note</p>
                      <p className="text-sm text-indigo-300/70 leading-snug">
                        AI-generated insights powered by <strong>Gemini 3</strong>.
                      </p>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-xs font-semibold">Live Data Active</span>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center max-w-lg mx-auto">
            <div className="w-24 h-24 bg-slate-900 rounded-full shadow-2xl flex items-center justify-center mb-8 border border-white/5">
              <Navigation className="text-indigo-500 animate-bounce" size={40} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Find Your Atmosphere</h2>
            <p className="text-slate-500 leading-relaxed mb-12">
              Search for any city to experience high-precision weather tracking enhanced by AI-driven insights.
            </p>
            <p className="text-sm font-medium text-slate-700 opacity-50">
              Ralph Lee &bull; 2025
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
