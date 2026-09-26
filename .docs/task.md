# Tarefas de Implementação

Este documento organiza a implementação do projeto em etapas progressivas, com foco em entregas pequenas e verificáveis. 
As tarefas devem seguir os requisitos definidos em [prd.md](prd.md) e não duplicam informações detalhadas do PRD.

## Convenção
- Cada tarefa está marcada com `[]` para ser preenchida conforme for concluída.
- A implementação deve ocorrer em ordem progressiva, uma tarefa por vez.
- Cada item possui um critério de aprovação claro para validar o resultado.
- A lógica de negócio e os requisitos visuais devem seguir as diretrizes de [prd.md](prd.md).

---

## Tarefa 1 — Configuração inicial do projeto

[X] Configurar o projeto base com Vite + TypeScript + Vanilla JS, garantindo que a aplicação rode localmente e que o ambiente esteja pronto para desenvolvimento.

Critério de aprovação:
- O projeto abre corretamente com `npm install` e `npm run dev`.
- A página inicial carrega sem erros no console.
- O ambiente está pronto para receber os módulos de UI e API.

Referência no PRD:
- Visão geral e arquitetura técnica em [prd.md](prd.md)

---

## Tarefa 2 — Estrutura base da interface

[X] Criar a estrutura HTML inicial da aplicação, incluindo o container principal, a área de busca e os blocos de conteúdo esperados pela interface mobile-first.

Critério de aprovação:
- Existe um campo de busca centralizado na parte superior.
- O layout possui container principal com borda arredondada e fundo claro.
- Há separação visual entre sidebar e área principal.
- A interface funciona corretamente em telas pequenas e médias.

Referência no PRD:
- Requisitos visuais e de UX em [prd.md](prd.md)

---

## Tarefa 3 — Estilos visuais da aplicação

[X] Implementar o CSS responsivo para atender ao design solicitado: fundo escuro, container centralizado, layout mobile-first e aparência compacta.

Critério de aprovação:
- O fundo geral da aplicação é escuro.
- O painel principal tem largura máxima adequada e bordas arredondadas.
- O layout se adapta bem ao mobile.
- A interface mantém legibilidade e organização visual sem quebra de layout.

Referência no PRD:
- Requisitos visuais e de UX em [prd.md](prd.md)

---

## Tarefa 4 — Módulo de integração com Open-Meteo

[] Criar um arquivo dedicado para encapsular as requisições à API Open-Meteo, com funções separadas para geocodificação e consulta de clima.

Critério de aprovação:
- Existe um módulo exclusivo para chamadas externas.
- A busca por cidade usa a API de geocodificação.
- A busca de clima usa latitude, longitude e timezone.
- A função verifica se os parâmetros necessários foram recebidos antes da requisição.
- Em caso de dados ausentes, a função retorna valor nulo/sem dados de forma segura.

Referência no PRD:
- Arquitetura técnica e regras de negócio em [prd.md](prd.md)

---

## Tarefa 5 — Normalização e validação de dados

[] Definir a lógica de validação para respostas da API, incluindo tratamento de entradas vazias, faltantes e incompletas.

Critério de aprovação:
- Dados vazios ou incompletos são tratados sem quebrar a interface.
- O código valida campos essenciais antes de renderizar.
- O sistema lida corretamente com cidade inexistente e clima indisponível.
- A aplicação evita erros de runtime quando a API falha ou retorna payload incompleto.

Referência no PRD:
- Requisitos funcionais, regras de negócio e tratamento de erro em [prd.md](prd.md)

---

## Tarefa 6 — Estado de carregamento

[] Implementar o estado de carregamento que aparece durante a busca da cidade e consulta do clima.

Critério de aprovação:
- Enquanto a busca está em andamento, o usuário vê feedback visual claro.
- O carregamento cobre o fluxo completo da operação.
- A interface não exibe conteúdo parcial ou inconsistente durante o carregamento.
- O estado desaparece ao final da resposta da API.

Referência no PRD:
- Estados da interface e performance em [prd.md](prd.md)

---

## Tarefa 7 — Empty state

[] Implementar a tela de estado vazio para quando a cidade não for encontrada ou quando os dados climáticos não estiverem disponíveis.

Critério de aprovação:
- A aplicação mostra mensagem clara de ausência de resultado.
- O empty state mantém o layout da página consistente.
- A interface continua legível e funcional em mobile.
- O caso de cidade inexistente e o caso de dados faltantes seguem a mesma regra de comportamento.

Referência no PRD:
- Empty state e regras de negócio em [prd.md](prd.md)

---

## Tarefa 8 — Renderização dos dados da cidade e clima

[] Implementar a lógica para renderizar os dados da cidade e do clima na interface, incluindo temperatura, cidade, dia/noite, chuva, código do país e weather code.

Critério de aprovação:
- Os dados essenciais aparecem na sidebar conforme o layout proposto.
- O valor da temperatura e da cidade são exibidos corretamente.
- O indicador de dia/noite e o status da chuva aparecem em formato legível.
- A aplicação renderiza apenas dados válidos.

Referência no PRD:
- Exibição dos dados e sidebar esquerda em [prd.md](prd.md)

---

## Tarefa 9 — Renderização dos detalhes climáticos

[] Implementar a área principal com os detalhes climáticos: umidade relativa, temperatura aparente, precipitação, velocidade e direção do vento.

Critério de aprovação:
- Os dados da área principal são exibidos corretamente.
- Os valores de velocidade e direção do vento aparecem juntos e com contexto.
- A lista de detalhes respeita o layout proposto.
- A interface continua funcional tanto em mobile quanto em telas maiores.

Referência no PRD:
- Área principal e dados climáticos em [prd.md](prd.md)

---

## Tarefa 10 — Fluxo principal de busca do usuário

[] Integrar a busca do usuário com toda a chain de execução: input → geocodificação → clima → renderização/estado de erro.

Critério de aprovação:
- O usuário digita uma cidade e aciona a busca.
- O sistema executa as duas requisições em sequência de forma transparente.
- Se sucesso, mostra os dados climáticos.
- Se falha, mostra empty state.
- O fluxo funciona sem quebrar a interface.

Referência no PRD:
- Fluxo de usuário e requisitos funcionais em [prd.md](prd.md)

---

## Tarefa 11 — Ajustes finais e validação da aplicação

[] Revisar o comportamento global da aplicação, corrigir inconsistências visuais e validar o fluxo completo em cenário real de uso.

Critério de aprovação:
- A aplicação está estável em cenário de sucesso e falha.
- Todos os estados críticos (loading, empty, sucesso) funcionam corretamente.
- O app atende aos requisitos do PRD no contexto visual e funcional.
- Não há erros visíveis de renderização ou console críticos.

Referência no PRD:
- Critérios de aceitação e observações finais em [prd.md](prd.md)

---

## Tarefa 12 — Documentação final e handoff para agentes

[] Preparar o documento final de apoio para manutenção, incluindo estado atual do projeto, pontos de extensão e próximos passos.

Critério de aprovação:
- A documentação explica como a aplicação funciona e onde cada parte do código deve ficar.
- O projeto está pronto para receber evolução incremental por agentes IA.
- O material é consistente com [prd.md](prd.md) e com a implementação atual.

Referência no PRD:
- Arquitetura técnica, escopo e conclusão em [prd.md](prd.md)
