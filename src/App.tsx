import { useEffect, useState } from "react";
import styles from "./App.module.css";

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
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetch(URL)
      .then((res) => {
        if (!res.ok)
          throw new Error(`Request failed with status: ${res.status}`);
        return res.json();
      })
      .then((json) => setWeatherData(json))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p>Could not load data</p>;
  if (!weatherData) return <p>Loading...</p>;

  const times = weatherData.hourly.time;

  const transformed = times.map((time, i) => ({
    time,
    temperature: weatherData.hourly.temperature_2m[i],
    feelsLike: weatherData.hourly.apparent_temperature[i],
  }));

  const next24Hours = transformed.slice(0, 24);
  const temperatureUnits = weatherData.hourly_units.temperature_2m;

  return (
    <>
      <h1 className={styles.title}>Weather app</h1>
      <section className={styles.container}>
        <ul className={styles.list}>
          {next24Hours.map((hour) => (
            <li key={hour.time}>
              <p className={styles.date}>
                {dateFormatter.format(new Date(hour.time))}
              </p>
              <p className={styles.noBreak}>
                Temperature: {""}
                <span className={styles.value}>
                  {hour.temperature}
                  {"\u00A0"}
                  {temperatureUnits}
                </span>
              </p>
              <p className={styles.noBreak}>
                Feels Like: {""}
                <span className={styles.value}>
                  {hour.feelsLike}
                  {"\u00A0"}
                  {temperatureUnits}
                </span>
              </p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default App;
