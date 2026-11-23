# Insights do Resumo executivo

Cada mês tem um arquivo `AAAA-MM.json` (ex.: `2026-11.json`), lido pela página `resumo.html`.

- Atualização automática: uma tarefa agendada reescreve o arquivo do mês corrente todo dia útil de manhã, a partir dos números do painel.
- Edição manual: pelo app do GitHub (abrir o arquivo → lápis → editar → commit). O que você escrever vale até a próxima atualização automática, que **mantém** as ações e decisões marcadas com `"fixo": true`.

Campos:
- `analise`: parágrafo de leitura do mês.
- `destaques`: lista de frases curtas.
- `acoes`: lista de `{ "acao", "responsavel", "prazo", "fixo" }`.
- `decisoes_yuri`: lista de frases com o que levar para decisão.
- `atualizado_em`, `autor`.

Se o arquivo do mês não existir, o resumo mostra só a leitura automática calculada na própria página.
