// Uso: node scripts/dados-resumo.js [arquivo.html]   (padrão: index.html)
// Imprime em JSON os números-chave do mês, já com as regras do resumo.html,
// para a tarefa diária escrever insights/AAAA-MM.json.
const fs = require('fs');
const arq = process.argv[2] || 'index.html';
function extrairD(html) {
  const i = html.indexOf('const D = '); let j = i + 10, dep = 0, inStr = false;
  for (; j < html.length; j++) { const c = html[j];
    if (inStr) { if (c === '\\') { j++; continue; } if (c === '"') inStr = false; continue; }
    if (c === '"') inStr = true; else if (c === '{') dep++; else if (c === '}') { dep--; if (dep === 0) break; } }
  return JSON.parse(html.slice(i + 10, j + 1));
}
const D = extrairD(fs.readFileSync(arq, 'utf8'));
const funis = D.funis || [{sufixo: 'inbound', dados: D}];
const inb = funis.find(f => f.sufixo === 'inbound').dados;
const hoje = (D.gerado_em || inb.gerado_em).slice(0, 10), fim = D.periodo_fim || inb.periodo_fim;
const out = {
  mes: (D.periodo_inicio || inb.periodo_inicio).slice(0, 7), gerado_em: D.gerado_em || inb.gerado_em,
  ritmo: inb.ritmo, meta_contratos: inb.meta_contratos, placar: inb.scoreboard,
  inbound: inb.consolidado, todos_funis: inb.consolidado_geral || null,
  canais: funis.map(f => ({canal: f.sufixo, consolidado: f.dados.consolidado, placar: f.dados.scoreboard,
    perdidos_top: ((f.dados.perdidos || {}).por_motivo || []).slice(0, 6)})),
  closers_ativos: (inb.closers_geral || inb.closers || []).filter(c => ['leads','cc1_realizada','cc1_futura','fpq_realizada','contratos','no_show'].some(k => c[k] > 0))
    .map(c => ({nome: c.nome, cc1: c.cc1_realizada, cc1_futura: c.cc1_futura, no_show: c.no_show, fpq: c.fpq_realizada, cc2: c.cc2_realizada, contrato_enviado: c.contrato_enviado, franquias: c.contratos_franquia, partners: c.contratos_partner})),
  sdrs_ativos: (inb.agendadores || []).filter(a => a.leads_recebidos > 0 || a.agendamentos > 0)
    .map(a => ({nome: a.nome, leads: a.leads_recebidos, agendamentos: a.agendamentos, pct_agendamento: a.pct_agendamento, pct_no_show: a.pct_no_show})),
  meta_agendamento: inb.agendadores_meta || null,
  previsao_aberta: (inb.previsao || []).filter(p => p.deal_status === 'open').map(p => {
    const probs = []; const dt = p.data_fechamento_esperada;
    if (dt && dt > fim) probs.push('postergado para depois do mês');
    else { if (!dt) probs.push('sem data'); else if (dt < hoje) probs.push('data vencida');
      if (p.probabilidade == null) probs.push('sem probabilidade');
      if (p.tipo_contrato === 'franquia' && !p.venda) probs.push('franquia sem valor'); }
    return {closer: p.closer, lead: p.lead, modelo: p.modelo, tipo: p.tipo_contrato, venda: p.venda, prob: p.probabilidade, fechamento: dt, confianca: p.confianca, problemas: probs};
  }),
  campanhas: inb.ranking ? inb.ranking.campanhas : null,
};
console.log(JSON.stringify(out, null, 1));
