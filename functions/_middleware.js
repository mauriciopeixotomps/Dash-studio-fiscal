// Protege resumo.html, /insights/* e /reunioes/* com uma senha simples (HTTP
// Basic Auth) — o resto do painel continua aberto, sem login. A senha fica
// numa variável de ambiente "Secret" do projeto Cloudflare Pages
// (RESUMO_SENHA, Settings > Variables and secrets), nunca no código.
const PROTEGIDO = [/^\/resumo(\.html)?$/, /^\/insights\//, /^\/reunioes\//];

export async function onRequest({ request, next, env }) {
  const url = new URL(request.url);
  if (!PROTEGIDO.some((re) => re.test(url.pathname))) return next();

  const cabecalho = request.headers.get('Authorization') || '';
  if (cabecalho.startsWith('Basic ') && env.RESUMO_SENHA) {
    try {
      const decodificado = atob(cabecalho.slice(6));
      const senha = decodificado.slice(decodificado.indexOf(':') + 1);
      if (senha === env.RESUMO_SENHA) return next();
    } catch (e) {
      // credencial malformada — cai no 401 abaixo
    }
  }
  return new Response('Acesso restrito ao Resumo executivo.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Resumo executivo"' },
  });
}
