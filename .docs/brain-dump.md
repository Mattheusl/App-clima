# Projeto clima.
Esse projeto com ajuda de api externa irá pegar a cidade escolhida do usuario e vai consultar o clima, exibindo as principais info: clima, temperatura, humidade etc

### Aspectos tecnicos
O projeto será feito vite + vanilla + typescript. 
Ele vai usar a API Open-Meteo com os seguintes END points

#### Para pegar latitude, longitude e TimeZONE:
https://geocoding-api.open-meteo.com/v1/search?name={NOME_DA_CIDADE}&count=1&language=en&format=json

{NOME_DA_CIDADE} - Nome da cidade que usuario digitou.

EXEMPLO DE RESPOSTA:
{
  "results": 
    {
      "id": 3448439,
      "name": "São Paulo",
      "latitude": -23.5475,
      "longitude": -46.63611,
      "elevation": 769,
      "feature_code": "PPLA",
      "country_code": "BR",
      "admin1_id": 3448433,
      "timezone": "America/Sao_Paulo",
      "population": 12400232,
      "postcodes": [
        "82010-340",
        "22640-101"
      ],
      "country_id": 3469034,
      "country": "Brazil",
      "admin1": "São Paulo"
    },
}

INFO CHAVES:
-name
-latitude
-longitude
-timezone
-country_code

#### Para pegar as infos de clima: 
https://api.open-meteo.com/v1/forecast?latitude={LATITUDE}&longitude={LONGITUDE}&current=precipitation_probability,temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m&timezone={TIMEZONE}

{LATITUDE} - latitude
{LONGITUDE} - longitude
{TIMEZONE} - timezone

EXEMPLO DE RESPOSTA:
{
  "latitude": -23.514938,
  "longitude": -46.610504,
  "generationtime_ms": 0.390768051147461,
  "utc_offset_seconds": 0,
  "timezone": "GMT",
  "timezone_abbreviation": "GMT",
  "elevation": 745,
  "current_units": {
    "time": "iso8601",
    "interval": "seconds",
    "temperature_2m": "°C",
    "relative_humidity_2m": "%",
    "apparent_temperature": "°C",
    "is_day": "",
    "precipitation": "mm",
    "rain": "mm",
    "weather_code": "wmo code",
    "wind_speed_10m": "km/h",
    "wind_direction_10m": "°"
  },
  "current": {
    "time": "2026-09-26T19:30",
    "interval": 900,
    "temperature_2m": 29.8,
    "relative_humidity_2m": 35,
    "apparent_temperature": 29.2,
    "is_day": 1,
    "precipitation": 0,
    "rain": 0,
    "weather_code": 0,
    "wind_speed_10m": 9.7,
    "wind_direction_10m": 260
  }
}

Info que precisamos:
-current_units
-current

Info chaves:
-temperature_2m
-relative_humidity_2m
-apparent_temperature
-is_day
-wind_speed_10m
-wind_direction_10m
-precipitation

##### Info importante:
Teremos um arquivo com as funções do OpenMeteo, para que o projeto não faça requisição direta a API mas sim use as funções desse arquivo.

Fluxo de pesquisa para receber o nome da cidade e info:
-Usuario digita o nome da cidade.
-O projeto pega o nome e usa OpenMeteo para pegar latitude, longitude e timezone dessa cidade.
-Ao pegar latitude, longitude e timezone, o projeto usa essas info para fazer a requisição e pega as info do clima dessa localização
-Caso nao ache as info da cidade, se comportar como se nao achado nada.
-Caso ache as informações da cidade mas nao as de clima, se comportar cmomo se nao achado nada

A busca requer 2 requisições (buscar latitude/longitude/timezone + buscar clima) mas para o usuario é só uma, com loading.

as funções do openmeteo devem verificar se os parametros vieram, se nao caso ao contrario  age como se nao tivesse nada.

###### Aspectos visuais:
Primeiramente queria especificar que gostaria que o projeto fosse aplicado com a metedologia "mobile-first" para maximo proveito no celular, quero que seja compacto e funcional para todas as telas pequenas ou grandes.

Tem que ter empty state.
Teremos uma area superior centralizada com apenas o campo de busca da cidade.
O projeto tera uma side bar na esquerda com as infos:
-Temperatura
-Cidade
-Dia ou noite
-Chuva
-Codigo do país
-WeatherCODE

Areá principal
-humidade relativa
-temperatura aparente
-probabilidade de precipitação
-velocidade/direção

Desing geral
-O projeto terá um fundo cinza escuro
-A parte superior nao terá background, mas tanto como a div e  a area principal ficarao dentro de uma div com borda arrendondada, fundo branco e largura maxima de 800pixels pode ser diferente para outras telas menores.
