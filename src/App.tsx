import { useEffect, useState } from "react";
import "./App.css";

const URL =
  "https://api.open-meteo.com/v1/forecast?latitude=55.6759&longitude=12.5655&hourly=temperature_2m,apparent_temperature&timezone=auto";

const dateFormatter = new Intl.DateTimeFormat("da-DK", {
  dateStyle: "short",
  timeStyle: "short",
});

interface WeatherData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly_units: {
    time: string;
    temperature_2m: string;
    apparent_temperature: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    apparent_temperature: number[];
  };
}

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetch(URL)
      .then((res) => res.json())
      .then((json) => setWeatherData(json));
  }, []);

  if (!weatherData) return <p>Loading...</p>;

  const hourlyData = weatherData.hourly.time;

  const transformed = hourlyData.map((hour, i) => ({
    hour,
    temperature: weatherData.hourly.temperature_2m[i],
    feelLike: weatherData.hourly.apparent_temperature[i],
  }));

  const dailyTransformed = transformed.slice(0, 24);
  console.log(dailyTransformed);

  return (
    <>
      <h1>Weather app</h1>
      {dailyTransformed.map((time) => (
        <p key={time.hour}>
          <span> Date and time: {dateFormatter.format(new Date(time.hour))}</span>
          <span> Temp: {time.temperature}</span>
          <span> Fells Like: {time.temperature}</span>
        </p>
      ))}
    </>
  );
}

export default App;
