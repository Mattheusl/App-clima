# PRD - Projeto Clima

## 1. Visão Geral

Este produto é uma aplicação web para consulta de clima por cidade, desenvolvida com Vite + Vanilla + TypeScript. A experiência principal é simples: o usuário digita o nome de uma cidade, a aplicação busca a localização geográfica dessa cidade e, em seguida, consulta o clima atual daquela região por meio da API Open-Meteo.

O objetivo é entregar uma interface compacta, funcional e mobile-first, com foco em uso em smartphones e adaptação responsiva para telas maiores.

## 2. Objetivo do Produto

Permitir que o usuário consulte rapidamente as condições climáticas de qualquer cidade, mostrando informações relevantes de forma clara, legível e visualmente organizada.

### Objetivos principais
- Buscar cidade por nome.
- Resolver latitude, longitude e timezone usando a API de geocodificação.
- Consultar clima atual usando a API meteorológica.
- Exibir estados de carregamento e ausência de resultado.
- Apresentar dados em layout compacto e responsivo.

## 3. Público-Alvo

Usuários que:
- querem verificar rapidamente o clima de uma cidade;
- acessam o site em dispositivos móveis;
- valorizam uma interface direta e sem distrações;
- não precisam de dashboards complexos, apenas informações essenciais.

## 4. Problema que Resolve

O usuário precisa de uma ferramenta simples para saber, em poucos segundos, as condições atuais do clima de uma cidade específica. A aplicação elimina a necessidade de acessar múltiplas páginas ou serviços externos, centralizando a busca num único fluxo.

## 5. Escopo

### Incluído
- Busca por cidade.
- Validação de entrada do usuário.
- Busca de geolocalização da cidade.
- Consulta do clima atual.
- Estados de carregamento.
- Estado vazio quando não houver resultados.
- Exibição de informações do clima em layout responsivo.

### Excluído (para esta versão)
- Histórico de buscas.
- Previsão de vários dias.
- Mapa interativo.
- Autenticação.
- Preferências do usuário.
- Integração com outras APIs meteorológicas.

## 6. Requisitos Funcionais

### 6.1 Busca por cidade
- O sistema deve permitir que o usuário digite o nome da cidade em um campo de busca.
- A busca deve iniciar mediante ação do usuário, como clique em botão ou Enter.
- O sistema deve tratar input vazio como ausência de busca válida.

### 6.2 Geocodificação
- O sistema deve consultar a API Open-Meteo de geocodificação para encontrar a cidade informada.
- A rota esperada deve receber o nome da cidade e retornar resultados com pelo menos:
  - name
  - latitude
  - longitude
  - timezone
  - country_code
- Caso a cidade não seja encontrada, o sistema deve se comportar como resultado não encontrado.
- Caso a API retorne dados incompletos, o sistema deve tratar como falha de busca.

### 6.3 Consulta de clima
- Após obter latitude, longitude e timezone, o sistema deve consultar a API de previsão climática atual.
- A resposta deve conter informações relevantes, especialmente:
  - temperature_2m
  - relative_humidity_2m
  - apparent_temperature
  - is_day
  - wind_speed_10m
  - wind_direction_10m
  - precipitation
  - weather_code
- Caso o clima não seja retornado, o sistema deve tratar como resultado ausente.

### 6.4 Estados da interface
- O sistema deve apresentar um estado de carregamento durante a busca.
- O sistema deve apresentar um estado vazio quando a cidade não existir ou quando os dados não forem encontrados.
- O sistema deve manter a experiência limpa mesmo em telas pequenas.

### 6.5 Exibição dos dados
- A interface deve mostrar pelo menos as seguintes informações:
  - Temperatura
  - Cidade
  - Dia ou noite
  - Chuva
  - Código do país
  - Weather code
  - Humidade relativa
  - Temperatura aparente
  - Probabilidade de precipitação
  - Velocidade e direção do vento

### 6.6 Tratamento de erro
- Quando a busca falhar por qualquer motivo, a aplicação deve informar ao usuário de forma clara que não foi possível localizar os dados.
- A aplicação não deve quebrar ao receber respostas vazias ou inconsistentes.
- As funções de integração da API devem verificar se os parâmetros esperados foram recebidos antes de executar a requisição.

## 7. Requisitos Não Funcionais

### 7.1 Performance
- A experiência deve ser responsiva e parecer imediata para o usuário.
- A busca deve ser executada em um fluxo de duas requisições, mas visualmente percebida como uma ação única.
- O carregamento deve ser visível durante o processo.

### 7.2 Compatibilidade
- Design mobile-first, com suporte a celulares e telas maiores.
- Deve funcionar em navegadores modernos sem dependência de frameworks pesados.

### 7.3 Manutenibilidade
- As requisições para Open-Meteo devem ficar em um arquivo específico de funções, isoladas da lógica de interface.
- A lógica de API deve ser reutilizável e centralizada.

### 7.4 Robustez
- A aplicação deve validar entradas e tratar respostas vazias, nulas ou incompletas.
- A estrutura de dados deve permitir fallback elegante para estado vazio.

## 8. Regras de Negócio

1. A busca inicia com uma string digitada pelo usuário.
2. O sistema deve considerar inválido o campo vazio ou sem conteúdo útil.
3. A cidade deve ser localizada antes da consulta do clima.
4. Se a cidade não for encontrada, a aplicação mostra empty state.
5. Se a cidade for encontrada, mas o clima não vier corretamente, a aplicação também mostra empty state.
6. O carregamento deve cobrir o processo completo de busca.
7. Todas as chamadas externas devem ocorrer por funções centralizadas e não diretamente no código de renderização.

## 9. Fluxo de Usuário

### Fluxo principal
1. O usuário acessa a aplicação.
2. Visualiza a área superior centralizada com campo de busca.
3. Digita o nome de uma cidade.
4. Clica em buscar ou envia o formulário.
5. O sistema executa a busca em duas etapas:
   - geocodificação da cidade;
   - consulta do clima da localização.
6. Se os dados forem válidos, a aplicação exibe as informações.
7. Se não houver dados válidos, a aplicação exibe um empty state.

## 10. Arquitetura Técnica

### 10.1 Stack
- Vite
- TypeScript
- Vanilla JS
- HTML + CSS
- API Open-Meteo

### 10.2 Estrutura sugerida
- src/main.ts: inicialização da aplicação.
- src/style.css: estilos visuais.
- src/openMeteo.ts: funções para geocodificação e clima.
- src/types.ts: tipos TypeScript para respostas da API (opcional, mas recomendado).

### 10.3 Integração com API
Deve existir um arquivo dedicado para abstrair chamadas a Open-Meteo. Esse módulo deve conter funções para:
- buscarCity(query: string)
- buscarClima(latitude: number, longitude: number, timezone: string)
- validar resposta da API
- normalizar dados
- retornar dados ou null/undefined quando inválidos

### 10.4 Padrão de resposta esperada
As funções da API devem verificar se os parâmetros vieram corretamente e, caso contrário, encerrar como resultado sem dados.

## 11. Dados e Estruturas

### 11.1 Dados da cidade
- name
- latitude
- longitude
- timezone
- country_code

### 11.2 Dados do clima
- temperature_2m
- relative_humidity_2m
- apparent_temperature
- is_day
- precipitation
- wind_speed_10m
- wind_direction_10m
- weather_code

### 11.3 Conversão e interpretação
- `is_day` deve ser interpretado para mostrar se é dia ou noite.
- `weather_code` deve ser mapeado para uma descrição legível do clima, caso a interface exija.
- `wind_direction_10m` deve ser exibido em conjunto com a velocidade do vento.
- `precipitation` pode representar chuva/precipitação atual.

## 12. Requisitos Visuais e de UX

### 12.1 Diretrizes gerais
- Mobile-first.
- Design compacto, direto e funcional.
- Fundo escuro geral.
- Container principal com bordas arredondadas, fundo branco e largura máxima próxima de 800px, adaptando-se para telas menores.
- A área superior não terá background e ficará centralizada.

### 12.2 Layout proposto
- Container centralizado em tela.
- Parte superior: campo de busca centralizado, sem caixa visual pesada.
- Parte inferior: layout em duas áreas principais:
  - sidebar à esquerda: informações principais do clima/cidade;
  - área principal à direita: dados detalhados.

### 12.3 Sidebar esquerda
Deve conter:
- Temperatura
- Cidade
- Dia ou noite
- Chuva
- Código do país
- Weather code

### 12.4 Área principal
Deve conter:
- Humidade relativa
- Temperatura aparente
- Probabilidade de precipitação
- Velocidade/direção do vento

### 12.5 Empty State
- Deve indicar claramente que a cidade não foi encontrada ou que os dados climáticos não estão disponíveis.
- Deve preservar o layout geral sem quebrar a composição.
- Deve ser legível em mobile.

### 12.6 Loading State
- Deve indicar claramente que a aplicação está processando a busca.
- Pode ser um spinner simples ou texto de carregamento no local do conteúdo.

## 13. Critérios de Aceitação

### Cenário 1: Cidade válida
- Dado que o usuário informa uma cidade existente;
- Quando a busca é executada;
- Então o sistema deve localizar a cidade, consultar o clima e exibir as informações corretamente.

### Cenário 2: Cidade inexistente
- Dado que o usuário informa uma cidade que não existe;
- Quando a busca é executada;
- Então o sistema deve exibir empty state.

### Cenário 3: Requisição incompleta
- Dado que a API retorna dados incompletos;
- Quando a busca é executada;
- Então o sistema deve tratar como falha e exibir empty state.

### Cenário 4: Mobile
- Dado que o usuário acessa em dispositivo móvel;
- Quando visualiza a tela;
- Então o layout deve se adaptar de forma legível com espaçamento e informação compacta.

## 14. Riscos e Considerações

- A API Open-Meteo pode retornar dados em formatos diferentes conforme cidade ou parâmetros.
- Algumas cidades podem ter nomes muito comuns, exigindo atenção ao retorno de múltiplos resultados.
- A busca em duas etapas deve ser tratada como um único fluxo para o usuário, sem expor complexidade técnica.
- O projeto exige atenção ao comportamento em telas pequenas, pois a interface deve ser simples e funcional.

## 15. Observações e Incertezas

Com base no material informado, as instruções são consistentes e suficientes para a criação do PRD. Não há pendências críticas que exijam interrupção para esclarecimento. A seguir, a implementação pode seguir diretamente as especificações acima.

## 16. Conclusão

Este projeto tem como foco uma experiência de clima rápida, visualmente limpa e adaptada para mobile, com consulta por cidade e uso de API externa. A proposta exige um fluxo simples para o usuário, mas com robustez na camada de integração e tratamento de erros para garantir confiabilidade mesmo quando a cidade ou dados climáticos não forem encontrados.
