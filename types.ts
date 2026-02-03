
export interface WeatherData {
  location: string;
  country: string;
  current: {
    temp: number;
    condition: string;
    description: string;
    humidity: number;
    windSpeed: number;
    feelsLike: number;
    uvIndex?: number;
    visibility?: number;
  };
  forecast: ForecastDay[];
  aiAdvice: string;
}

export interface ForecastDay {
  date: string;
  dayName: string;
  high: number;
  low: number;
  condition: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
