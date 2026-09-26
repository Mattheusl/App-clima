export type CityResult = {
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  country_code: string;
  admin1?: string;
  country?: string;
};

export type WeatherResult = {
  temperature_2m: number | null;
  relative_humidity_2m: number | null;
  apparent_temperature: number | null;
  is_day: number | null;
  precipitation: number | null;
  precipitation_probability: number | null;
  wind_speed_10m: number | null;
  wind_direction_10m: number | null;
  weather_code: number | null;
};

type SearchResponse = {
  results?: Array<{
    name?: string;
    latitude?: number;
    longitude?: number;
    timezone?: string;
    country_code?: string;
    country?: string;
    admin1?: string;
  }>;
};

type ForecastResponse = {
  current?: {
    temperature_2m?: number | null;
    relative_humidity_2m?: number | null;
    apparent_temperature?: number | null;
    is_day?: number | null;
    precipitation?: number | null;
    precipitation_probability?: number | null;
    wind_speed_10m?: number | null;
    wind_direction_10m?: number | null;
    weather_code?: number | null;
  };
};

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function searchCity(query: string, mode: 'city' | 'state' | 'exact' = 'city'): Promise<CityResult | null> {
  const city = query.trim();

  if (!city) {
    return null;
  }

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=10&language=en&format=json`;
  const data = await fetchJson<SearchResponse>(url);

  if (!data?.results?.length) {
    return null;
  }

  const normalizedQuery = city.toLowerCase();
  const ranked = [...data.results].sort((a, b) => {
    const aScore = scoreCandidate(a, normalizedQuery, mode);
    const bScore = scoreCandidate(b, normalizedQuery, mode);
    return bScore - aScore;
  });

  const candidate = ranked[0];

  if (!candidate?.name || !candidate.latitude || !candidate.longitude || !candidate.timezone) {
    return null;
  }

  return {
    name: candidate.name,
    latitude: Number(candidate.latitude),
    longitude: Number(candidate.longitude),
    timezone: candidate.timezone,
    country_code: candidate.country_code || 'N/A',
    admin1: candidate.admin1,
    country: candidate.country || candidate.country_code || 'N/A',
  };
}

function scoreCandidate(
  item: { name?: string; admin1?: string; country?: string; country_code?: string },
  query: string,
  mode: 'city' | 'state' | 'exact',
): number {
  const name = item.name?.toLowerCase() ?? '';
  const admin = (item.admin1 ?? '').toLowerCase();
  const country = (item.country ?? '').toLowerCase();
  const countryCode = (item.country_code ?? '').toLowerCase();
  const fullLabel = `${name} ${admin} ${country} ${countryCode}`.trim();
  const queryParts = query.split(/\s+/).filter(Boolean);

  let score = 0;

  if (mode === 'state') {
    if (admin === query) score += 200;
    if (admin.includes(query)) score += 120;
    if (country === query) score += 90;
    if (name === query) score += 40;
    if (fullLabel.includes(query)) score += 80;
  }

  if (mode === 'exact') {
    if (fullLabel === query) score += 180;
    if (name === query) score += 100;
    if (admin === query) score += 110;
    if (country === query) score += 80;
  }

  if (mode === 'city') {
    if (name === query) score += 120;
    if (admin === query) score += 100;
    if (country === query) score += 90;
    if (fullLabel === query) score += 110;
  }

  if (name.includes(query)) score += 60;
  if (admin.includes(query)) score += 75;
  if (country.includes(query)) score += 55;
  if (countryCode.includes(query)) score += 50;

  for (const part of queryParts) {
    if (!part) continue;
    if (name.includes(part)) score += 18;
    if (admin.includes(part)) score += 22;
    if (country.includes(part)) score += 15;
    if (countryCode.includes(part)) score += 12;
  }

  return score;
}

export async function fetchWeatherData(
  latitude: number,
  longitude: number,
  timezone: string,
): Promise<WeatherResult | null> {
  if (!latitude || !longitude || !timezone) {
    return null;
  }

  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    timezone,
  });

  const url = `https://api.open-meteo.com/v1/forecast?current=precipitation_probability,temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m&${params.toString()}`;

  const data = await fetchJson<ForecastResponse>(url);

  if (!data?.current) {
    return null;
  }

  const current = data.current;

  return {
    temperature_2m: current.temperature_2m ?? null,
    relative_humidity_2m: current.relative_humidity_2m ?? null,
    apparent_temperature: current.apparent_temperature ?? null,
    is_day: current.is_day ?? null,
    precipitation: current.precipitation ?? null,
    precipitation_probability: current.precipitation_probability ?? null,
    wind_speed_10m: current.wind_speed_10m ?? null,
    wind_direction_10m: current.wind_direction_10m ?? null,
    weather_code: current.weather_code ?? null,
  };
}
