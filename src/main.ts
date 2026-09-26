import './style.css';

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
          placeholder="Digite uma cidade"
          aria-label="Digite uma cidade"
        />
        <button type="submit">Buscar</button>
      </form>
    </header>

    <main class="weather-panel">
      <aside class="weather-sidebar" aria-label="Resumo do clima">
        <div class="temperature-row">
          <span class="temp-value">29°</span>
          <span class="temp-unit">C</span>
        </div>

        <div class="location-block">
          <h1>São Paulo</h1>
          <p>Brasil</p>
        </div>

        <ul class="side-list">
          <li>
            <span>Dia / Noite</span>
            <strong>Dia</strong>
          </li>
          <li>
            <span>Chuva</span>
            <strong>0 mm</strong>
          </li>
          <li>
            <span>Código do país</span>
            <strong>BR</strong>
          </li>
          <li>
            <span>Weather code</span>
            <strong>0</strong>
          </li>
        </ul>
      </aside>

      <section class="weather-main" aria-label="Detalhes do clima">
        <div class="details-grid">
          <div class="detail-card">
            <span>Humidade relativa</span>
            <strong>35%</strong>
          </div>

          <div class="detail-card">
            <span>Temperatura aparente</span>
            <strong>29.2°C</strong>
          </div>

          <div class="detail-card">
            <span>Probabilidade de precipitação</span>
            <strong>12%</strong>
          </div>

          <div class="detail-card">
            <span>Velocidade / direção</span>
            <strong>9.7 km/h / 260°</strong>
          </div>
        </div>
      </section>
    </main>
  </div>
`;

const form = document.querySelector('.search-form');

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.querySelector('#city-search') as HTMLInputElement | null;

  if (!input) {
    return;
  }

  const value = input.value.trim();

  if (!value) {
    input.focus();
    return;
  }

  if (value.toLowerCase() === 'sao paulo' || value.toLowerCase() === 'são paulo') {
    input.value = 'São Paulo';
  }
});
