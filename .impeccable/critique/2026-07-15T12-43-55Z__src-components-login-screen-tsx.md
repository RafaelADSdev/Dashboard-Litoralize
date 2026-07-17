---
target: login screen
total_score: 27
p0_count: 1
p1_count: 1
timestamp: 2026-07-15T12-43-55Z
slug: src-components-login-screen-tsx
---
---
target: Tela de login (src/components/login-screen.tsx)
total_score: 27
p0_count: 1
p1_count: 1
timestamp: 2026-07-15T12-40-00Z
slug: src-components-login-screen-tsx
---
Method: dual-agent (A: 757c26e2-28c0-4fec-b731-5fd105b82fbb · B: caaede38-df24-48c5-a486-293c9bef7142)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | "Entrando…" e botão desabilitado funcionam; sem estado para credencial inválida ou falha de rede |
| 2 | Match System / Real World | 4 | PT-BR, ícones convencionais, fluxo de login familiar |
| 3 | User Control and Freedom | 2 | Sem "esqueci minha senha", suporte ou saída para usuário travado |
| 4 | Consistency and Standards | 3 | Uppercase + tracking repetido em eyebrow, labels e botão na mesma tela |
| 5 | Error Prevention | 3 | Valida campo vazio; submit bloqueado até preencher; sem autofocus |
| 6 | Recognition Rather Than Recall | 4 | Labels persistentes, autocomplete, toggle de senha com aria-pressed |
| 7 | Flexibility and Efficiency | 2 | Sem atalhos, "lembrar-me" ou SSO para uso recorrente em reunião |
| 8 | Aesthetic and Minimalist Design | 3 | Formulário limpo; hero ocupa ~65% sem dado útil |
| 9 | Error Recovery | 2 | Erros de campo vazios ok; autenticação real não tem recuperação |
| 10 | Help and Documentation | 1 | Nenhum link de ajuda ou contato de TI |
| **Total** | | **27/40** | **Acceptable** |

## Anti-Patterns Verdict

**LLM assessment:** Não é slop puro após o polish — grade/glow removidos, tokens alinhados ao DESIGN.md, logos via asset pipeline. Ainda assim, o reflexo "CRM roxo escuro + split hero decorativo" permanece legível: 65% da viewport é branding sem dado, eyebrow dourado uppercase é o único kicker permitido mas compete com labels uppercase, e o violeta `#240046` na porta de entrada diverge do slate do dashboard.

**Deterministic scan:** `detect.mjs` em `login-screen.tsx` → **0 achados** (exit 0). O dashboard (`index.tsx`) ainda acusa `ai-color-palette` na barra de tendência — fora do escopo desta tela, mas relevante para continuidade pós-login.

**Visual overlays:** Não disponíveis — browser automation ausente nesta sessão. HTTP smoke em `http://localhost:8080/` retornou 200 com preload dos assets Focus/HubON.

## Overall Impression

A login evoluiu de protótipo visual para superfície de produto: acessibilidade sólida, responsividade cuidadosa, estados de foco/disabled/submit. O maior gap é funcional: a autenticação é um mock (`setIsAuthenticated(true)` sem validar credenciais), o que torna toda a tela um teatro de formulário — aceitável em protótipo, inaceitável se for a porta real do war room comercial.

## What's Working

1. **Acessibilidade** — `useId`, `aria-invalid`, `aria-describedby`, `role="alert"`, `aria-busy`, toggle de senha com `aria-pressed`.
2. **Prevenção básica** — botão desabilitado até preencher; erros inline por campo; `prefers-reduced-motion` respeitado.
3. **Assets confiáveis** — logos importadas via Vite (`src/assets/`), sem risco de 404 na pasta `public`.

## Priority Issues

### [P0] Autenticação mock sem feedback de falha
- **Why:** `onAuthenticate()` dispara sempre que os campos não estão vazios; não há credencial inválida, timeout nem mensagem de erro. Gestora em reunião não distingue "processando" de "falhou".
- **Fix:** Integrar auth real (ou simular falha); expor estado `error` global no formulário; resetar `isSubmitting` em falha.
- **Suggested command:** `$impeccable harden src/components/login-screen.tsx`

### [P1] Hero decorativo sem dado (65% da tela)
- **Why:** Contraria PRODUCT.md ("dados antes de decoração") e anti-ref "hero sem densidade real". Espaço não reforça confiança nem orienta a tarefa.
- **Fix:** Reduzir hero, mostrar preview de métrica (ex.: funil ativo do mês) ou fundir branding no painel do formulário.
- **Suggested command:** `$impeccable distill src/components/login-screen.tsx`

### [P2] Descontinuidade visual login → dashboard
- **Why:** Login `#240046` + gradiente violeta; dashboard slate + liquid glass. Primeira impressão não parece o mesmo produto.
- **Fix:** Aproximar canvas do login ao `oklch(0.12 0.04 300)` do DESIGN.md ou transição explícita pós-auth.
- **Suggested command:** `$impeccable colorize src/components/login-screen.tsx src/styles.css`

### [P3] Hierarquia tipográfica repetida
- **Why:** Mesmo vocabulário uppercase+tracking em eyebrow, labels e botão — DESIGN.md pede labels escassos.
- **Fix:** Labels em sentence case; reservar uppercase só ao kicker "Dashboard Comercial".
- **Suggested command:** `$impeccable typeset src/components/login-screen.tsx`

### [P3] Mobile esconde logos no lockup
- **Why:** Em `<46rem`, `.login-brand-lockup { display: none }` remove Focus/HubON do formulário; só resta texto no hero compacto.
- **Fix:** Manter lockup reduzido no topo do formulário mobile.
- **Suggested command:** `$impeccable adapt src/components/login-screen.tsx`

## Persona Red Flags

**Marina (Gestora em reunião):** Falha silenciosa de login = ansiedade sem saída; sem autofocus = clique extra antes de digitar; sem "lembrar sessão" = reautenticação em toda reunião; hero vazio não confirma que está no dashboard certo.

**Alex (power user):** Sem Enter-to-submit explícito além do form nativo; sem atalho para focar primeiro campo; mock auth impede testar fluxo real.

**Sam (accessibility):** Foco visível presente nos controles; risco: `opacity: 0.45` no botão disabled pode parecer "invisível" para baixa visão — preferir contraste mantido com `cursor: not-allowed` sem apagar cor.

## Minor Observations

1. Placeholder "Digite seu usuário" duplica o label — poderia indicar formato (e-mail corporativo).
2. Footer discreto e bem posicionado — não compete com a tarefa.
3. Reticências tipográficas em "Entrando…" — detalhe de acabamento correto.

## Questions to Consider

1. Se o login é só gate temporário até auth real, vale manter o hero decorativo ou já mostrar um número do funil?
2. O canvas `#240046` foi escolhido de propósito para diferenciar a porta de entrada, ou deve espelhar o dashboard?
3. Credenciais erradas devem bloquear com mensagem inline ou toast global?
