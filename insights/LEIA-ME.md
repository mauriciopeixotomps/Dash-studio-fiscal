# Insights do Resumo executivo

Cada mês tem um arquivo `AAAA-MM.json` (ex.: `2026-11.json`), lido pela página `resumo.html`.

- Atualização automática: uma tarefa agendada reescreve o arquivo do mês corrente todo dia útil de manhã, a partir dos números do painel.
- Correção manual: na página do Resumo executivo, botão "Corrigir resumo" → editar → "Publicar correção" → confirmar o commit no GitHub. A correção vai para `insights/ajustes/` e o fluxo do repositório a aplica neste arquivo em 1 a 2 minutos. Também dá para editar o arquivo direto pelo GitHub (lápis → editar → commit).
- A próxima atualização automática reescreve análise e destaques, mas **mantém** as ações e decisões marcadas com `"fixo": true` (opção "fixar" no editor).

Campos:
- `analise`: parágrafo de leitura do mês.
- `destaques`: lista de frases curtas.
- `acoes`: lista de `{ "acao", "responsavel", "prazo", "fixo" }`.
- `decisoes_yuri`: lista de frases com o que levar para decisão; uma decisão fixada vira `{ "texto", "fixo": true }`.
- `atualizado_em`, `autor`.

Se o arquivo do mês não existir, o resumo mostra só a leitura automática calculada na própria página.
