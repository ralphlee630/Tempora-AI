
import React from 'react';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  Wind, 
  Droplets, 
  Eye, 
  Thermometer,
  CloudFog,
  Navigation
} from 'lucide-react';

export const WeatherIcon: React.FC<{ condition: string, className?: string }> = ({ condition, className }) => {
  const lower = condition.toLowerCase();
  if (lower.includes('sun') || lower.includes('clear')) return <Sun className={className || "text-yellow-400"} />;
  if (lower.includes('rain') || lower.includes('drizzle')) return <CloudRain className={className || "text-blue-400"} />;
  if (lower.includes('snow')) return <CloudSnow className={className || "text-sky-200"} />;
  if (lower.includes('storm') || lower.includes('thunder')) return <CloudLightning className={className || "text-purple-400"} />;
  if (lower.includes('fog') || lower.includes('mist')) return <CloudFog className={className || "text-slate-400"} />;
  return <Cloud className={className || "text-slate-400"} />;
};

export { Sun, Cloud, Wind, Droplets, Eye, Thermometer, Navigation };
