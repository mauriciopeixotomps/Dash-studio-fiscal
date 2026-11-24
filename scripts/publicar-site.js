// Uso: node scripts/publicar-site.js <pasta do site>
// Roda no GitHub Actions antes de publicar o painel (ver .github/workflows/publicar-painel.yml).
// 1. Acrescenta o botão "Resumo executivo" nas páginas do painel geradas pelo robô.
// 2. Gera reunioes/index.json com as notas de reunião publicadas (reunioes/AAAA-MM-DD*.md).
const fs = require('fs');
const path = require('path');
const site = process.argv[2] || '_site';

const ancora = /(<a class="page-nav-link" href="personalizado\.html">[^<]*<\/a>)/;
const botao = '<a class="page-nav-link" href="resumo.html">📋 Resumo executivo</a>';
let n = 0;
for (const f of fs.readdirSync(site)) {
  if (!f.endsWith('.html') || f === 'resumo.html' || f === 'personalizado.html') continue;
  const p = path.join(site, f);
  const html = fs.readFileSync(p, 'utf8');
  if (html.includes('href="resumo.html"') || !ancora.test(html)) continue;
  fs.writeFileSync(p, html.replace(ancora, '$1\n      ' + botao));
  n++;
}
console.log(`Botão do resumo incluído em ${n} página(s).`);

const dir = path.join(site, 'reunioes');
fs.mkdirSync(dir, { recursive: true });
const notas = fs.readdirSync(dir)
  .filter(f => /^\d{4}-\d{2}-\d{2}.*\.md$/.test(f))
  .sort().reverse()
  .map(f => ({ arquivo: f, data: f.slice(0, 10) }));
fs.writeFileSync(path.join(dir, 'index.json'), JSON.stringify(notas, null, 1));
console.log(`${notas.length} nota(s) de reunião no índice.`);
