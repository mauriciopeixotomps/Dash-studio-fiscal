// Uso: node scripts/aplicar-ajustes.js [pasta do repositório]
// Roda no GitHub Actions (ver .github/workflows/publicar-painel.yml).
// Aplica as correções feitas pelo botão "Corrigir resumo" (insights/ajustes/*.json)
// no arquivo do mês, insights/AAAA-MM.json, e apaga o arquivo de ajuste.
const fs = require('fs');
const path = require('path');
const raiz = process.argv[2] || '.';
const dir = path.join(raiz, 'insights', 'ajustes');
if (!fs.existsSync(dir)) process.exit(0);
const arquivos = fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort();
for (const f of arquivos) {
  const p = path.join(dir, f);
  let aj;
  try { aj = JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch (e) { console.log(`Ignorado (JSON inválido): ${f}`); continue; }
  const mes = aj.mes || f.slice(0, 7);
  if (!/^\d{4}-\d{2}$/.test(mes)) { console.log(`Ignorado (mês inválido): ${f}`); continue; }
  const alvo = path.join(raiz, 'insights', mes + '.json');
  let atual = {};
  try { atual = JSON.parse(fs.readFileSync(alvo, 'utf8')); } catch (e) {}
  for (const k of ['analise', 'destaques', 'acoes', 'decisoes_yuri']) if (aj[k] !== undefined) atual[k] = aj[k];
  atual.atualizado_em = aj.salvo_em || atual.atualizado_em;
  atual.autor = 'Maurício (ajuste manual)';
  const ordem = ['atualizado_em', 'autor', 'analise', 'destaques', 'acoes', 'decisoes_yuri'];
  const saida = {};
  for (const k of ordem) if (atual[k] !== undefined) saida[k] = atual[k];
  for (const k of Object.keys(atual)) if (!(k in saida)) saida[k] = atual[k];
  fs.writeFileSync(alvo, JSON.stringify(saida, null, 2) + '\n');
  fs.unlinkSync(p);
  console.log(`Correção aplicada: ${f} -> insights/${mes}.json`);
}
