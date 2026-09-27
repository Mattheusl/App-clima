import './style.css';
import {
  fetchWeatherData,
  searchCity,
  type CityResult,
  type WeatherResult,
} from './openMeteo';

type WeatherViewModel = {
  city: CityResult;
  weather: WeatherResult;
};

const app = document.querySelector('#app');

if (!app) {
  throw new Error('Container #app não foi encontrado.');
}

app.innerHTML = `
  <div class="weather-app">
    <header class="topbar">
      <form class="search-form" aria-label="Busca de cidade">
        <label class="sr-only" for="city-search">Nome da cidade</label>
        <input
          id="city-search"
          name="city"
          type="text"
          placeholder="Digite cidade"
          aria-label="Digite cidade"
        />
        <button type="submit">Buscar</button>
      </form>
    </header>

    <main class="weather-panel" aria-live="polite"></main>
  </div>
`;

const weatherPanel = document.querySelector('.weather-panel') as HTMLElement | null;
const form = document.querySelector('.search-form') as HTMLFormElement | null;
const cityInput = document.querySelector('#city-search') as HTMLInputElement | null;

const mapWeatherCode = (code: number | null): string => {
  if (code === null || code === undefined) {
    return 'Sem dado';
  }

  const map: Record<number, string> = {
    0: 'Céu limpo',
    1: 'Principalmente limpo',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Neblina',
    48: 'Nevoeiro com geada',
    51: 'Garoa leve',
    53: 'Garoa moderada',
    55: 'Garoa intensa',
    56: 'Garoa gelada leve',
    57: 'Garoa gelada intensa',
    61: 'Chuva leve',
    63: 'Chuva moderada',
    65: 'Chuva forte',
    66: 'Chuva gelada leve',
    67: 'Chuva gelada forte',
    71: 'Neve leve',
    73: 'Neve moderada',
    75: 'Neve forte',
    80: 'Pancadas leves',
    81: 'Pancadas moderadas',
    82: 'Pancadas fortes',
    85: 'Neve leve',
    86: 'Neve forte',
    95: 'Trovoada',
    96: 'Trovoada com granizo',
    99: 'Trovoada com granizo forte',
  };

  return map[code] ?? 'Condição não identificada';
};

const formatTemperature = (value: number | null): string => {
  if (value === null || value === undefined) {
    return 'N/D';
  }

  return `${Math.round(value)}°C`;
};

const formatOptionalNumber = (value: number | null, unit: string): string => {
  if (value === null || value === undefined) {
    return 'N/D';
  }

  return `${value}${unit}`;
};

const getDayLabel = (value: number | null): string => {
  if (value === 1) {
    return 'Dia';
  }

  if (value === 0) {
    return 'Noite';
  }

  return 'Indisponível';
};

function renderLoadingState(): void {
  if (!weatherPanel) {
    return;
  }

  weatherPanel.innerHTML = `
    <div class="state-card loading">
      <div class="spinner" aria-hidden="true"></div>
      <p>Buscando clima...</p>
    </div>
  `;
}

function renderIdleState(): void {
  if (!weatherPanel) {
    return;
  }

  weatherPanel.innerHTML = `
    <div class="state-card idle">
      <h2>Clima do momento</h2>
      <p>Busque por uma cidade para ver o clima atual.</p>
    </div>
  `;
}

function renderEmptyState(message: string): void {
  if (!weatherPanel) {
    return;
  }

  weatherPanel.innerHTML = `
    <div class="state-card empty">
      <h2>Sem resultados</h2>
      <p>${message}</p>
    </div>
  `;
}

function renderWeatherData({ city, weather }: WeatherViewModel): void {
  if (!weatherPanel) {
    return;
  }

  const temperature = formatTemperature(weather.temperature_2m);
  const apparent = weather.apparent_temperature === null ? 'N/D' : `${weather.apparent_temperature.toFixed(1)}°C`;
  const humidity = formatOptionalNumber(weather.relative_humidity_2m, '%');
  const precipitation = formatOptionalNumber(weather.precipitation, ' mm');
  const precipitationProbability = formatOptionalNumber(weather.precipitation_probability, '%');
  const wind = `${weather.wind_speed_10m ?? 'N/D'} km/h / ${weather.wind_direction_10m ?? 'N/D'}°`;

  weatherPanel.innerHTML = `
    <aside class="weather-sidebar" aria-label="Resumo do clima">
      <div class="temperature-row">
        <span class="temp-value">${temperature}</span>
      </div>

      <div class="location-block">
        <h1>${city.name}</h1>
        <p>${[city.admin1, city.country || city.country_code].filter(Boolean).join(' • ') || 'País não informado'}</p>
      </div>

      <ul class="side-list">
        <li>
          <span>Dia / Noite</span>
          <strong>${getDayLabel(weather.is_day)}</strong>
        </li>
        <li>
          <span>Chuva</span>
          <strong>${precipitation}</strong>
        </li>
        <li>
          <span>Código do país</span>
          <strong>${city.country_code || 'N/A'}</strong>
        </li>
        <li>
          <span>Clima</span>
          <strong>${mapWeatherCode(weather.weather_code)}</strong>
        </li>
      </ul>
    </aside>

    <section class="weather-main" aria-label="Detalhes do clima">
      <div class="details-grid">
        <div class="detail-card">
          <span>Humidade relativa</span>
          <strong>${humidity}</strong>
        </div>

        <div class="detail-card">
          <span>Temperatura aparente</span>
          <strong>${apparent}</strong>
        </div>

        <div class="detail-card">
          <span>Probabilidade de precipitação</span>
          <strong>${precipitationProbability}</strong>
        </div>

        <div class="detail-card">
          <span>Velocidade / direção</span>
          <strong>${wind}</strong>
        </div>
      </div>
    </section>
  `;
}

async function handleSubmit(event: SubmitEvent): Promise<void> {
  event.preventDefault();

  if (!cityInput || !form) {
    return;
  }

  const query = cityInput.value.trim();

  if (!query) {
    cityInput.focus();
    return;
  }

  renderLoadingState();

  try {
    const city = await searchCity(query);

    if (!city) {
      renderEmptyState('Local não encontrado ou os dados não estão disponíveis.');
      return;
    }

    const weather = await fetchWeatherData(city.latitude, city.longitude, city.timezone);

    if (!weather) {
      renderEmptyState('Não foi possível obter o clima dessa localização.');
      return;
    }

    renderWeatherData({ city, weather });
  } catch {
    renderEmptyState('Não foi possível consultar o clima neste momento.');
  }
}

form?.addEventListener('submit', handleSubmit);
renderIdleState();
