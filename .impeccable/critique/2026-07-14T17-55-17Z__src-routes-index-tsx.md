---
target: Dashboard principal (src/routes/index.tsx)
total_score: 23
p0_count: 2
p1_count: 2
timestamp: 2026-07-14T17-55-17Z
slug: src-routes-index-tsx
---
Method: dual-agent (A: cb66838d-8cd3-44e1-b14e-b910ee4881fa · B: 516cf5df-ec47-478f-ae3c-e1918ead0f5b)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Chip de período e status Bitrix funcionam; `AnimatedNumber` (650ms) atrasa leitura do valor real |
| 2 | Match System / Real World | 3 | Terminologia comercial correta; abreviações da tabela exigem vocabulário interno |
| 3 | User Control and Freedom | 2 | Tabs e gráfico clicável permitem voltar; troca de mês reinicia animação completa |
| 4 | Consistency and Standards | 2 | DS diz glass só em KPIs, mas `liquid-glass` cobre painéis e tabela; navbar roxa + controles brancos fragmentam vocabulário |
| 5 | Error Prevention | 3 | Select e presets limitam entradas; `placeholderData` evita tela vazia |
| 6 | Recognition Rather Than Recall | 3 | Tabs, legenda com bolinhas e chip ajudam; 10+ colunas exigem memorizar abreviações |
| 7 | Flexibility and Efficiency | 2 | Presets e clique no gráfico são bons; zero atalhos de teclado, sem URL compartilhável |
| 8 | Aesthetic and Minimalist Design | 2 | Overview empilha KPIs glass + 2 painéis com peso similar; gradientes decorativos competem com números |
| 9 | Error Recovery | 2 | Erro inline em `dashboard-source`; sem botão "tentar novamente" |
| 10 | Help and Documentation | 1 | Sem glossário de fases; `title` em `<th>` insuficiente para projetor |
| **Total** | | **23/40** | **Acceptable** |

## Anti-Patterns Verdict

**LLM assessment:** Não é slop puro — a IA de domínio aparece (fases Bitrix, tabela por corretor, separação ativo/perdas). Mas os tells são visíveis: `liquid-glass` com borda cônica em quase todo painel, orbes roxos em `dash-content::before`, `LABEL_CHROME` em caixa alta em cada bloco, e sequência de entrada escalonada. Um gestor confiaria na estrutura de dados, mas pausaria no glass fora dos KPIs e na coreografia de load num dashboard operacional.

**Deterministic scan:** 17 achados (1 warning, 16 advisory). 1× `ai-color-palette` em gradiente violeta da barra de tendência (`index.tsx:622`). 16× `design-system-color` — maioria falso positivo (rampa violeta documentada em DESIGN.md), mas 14 cores hardcoded em `styles.css` indicam token drift real.

**Visual overlays:** Não disponíveis — browser automation ausente nesta sessão.

## Overall Impression

O dashboard tem ossatura analítica sólida para o caso Focus: funil separado de perdas, presets de período inteligentes, tabela densa por corretor. O maior gap entre intenção ("war room comercial") e execução é o **modo escuro não ativado** no HTML — o design system escuro existe no CSS mas não renderiza — somado a **animações de entrada que atrasam a leitura** num contexto de reunião com tempo curto.

## What's Working

1. **Separação ativo/perdas** — barras distintas, rótulo "Perdas" em vermelho, coluna `Neg. perd.` com tratamento visual próprio na tabela.
2. **Presets de período + gráfico clicável** — chip `2026 · {mês}`, atalhos Ano todo/Mês atual/Pico, e colunas do gráfico como filtro rápido.
3. **`tabular-nums` e densidade da tabela** — números alinhados, avatares compactos, corretores ativos primeiro.

## Priority Issues

### [P0] Modo escuro não ativado — design system inerte
- **Why:** `<html>` em `__root.tsx` não tem `class="dark"`. Tokens `--dash-bg-*`, `.dark .dash-shell` e variantes `dark:` não aplicam. Projetor mostra fundo `#eef0f4` claro.
- **Fix:** Adicionar `class="dark"` em `<html>`; validar contraste no canvas escuro real.
- **Suggested command:** `$impeccable colorize src/routes/__root.tsx src/styles.css`

### [P0] Animações de entrada bloqueiam leitura instantânea
- **Why:** `kpi-enter`, `panel-enter`, `AnimatedNumber` (650ms) e delays escalonados violam registro produto. Gestor precisa do número agora, não em 0,7s.
- **Fix:** Default `motionTier: "instant"`; animações só com toggle "Modo apresentação".
- **Suggested command:** `$impeccable animate src/routes/index.tsx`

### [P1] Glass fora dos KPIs — violação do DS
- **Why:** `Card` aplica `liquid-glass` sempre; tabela usa `glass`. Conic-gradient e blur 30px em painéis de dados = theater.
- **Fix:** Restringir `liquid-glass` a `GlassKpiCard`; painéis de gráfico/tabela usam `dash-panel` opaco.
- **Suggested command:** `$impeccable quieter src/routes/index.tsx src/styles.css`

### [P1] Tabela de corretores ilegível em panorama
- **Why:** `min-w-[960px]`, 10+ colunas; scroll horizontal obrigatório no projetor.
- **Fix:** Congelar colunas Corretor + Ativo; agrupar fases em blocos; vista alternativa para reunião.
- **Suggested command:** `$impeccable layout src/routes/index.tsx`

### [P2] Eyebrows `LABEL_CHROME` em excesso
- **Why:** `tracking-[0.2em]` + uppercase em header, cada KPI, cada seção — tell de AI grammar.
- **Fix:** Um único kicker no header; labels de seção em sentence case sem tracking extremo.
- **Suggested command:** `$impeccable typeset src/routes/index.tsx src/styles.css`

## Persona Red Flags

**Alex (power user):** Sem atalhos de teclado entre tabs; troca de mês reinicia coreografia; tabela sem sort por coluna; impossível compartilhar URL equipe+mês.

**Sam (accessibility):** Tabs com `aria-pressed` incorreto, sem `aria-controls`/`tabpanel`, sem arrow-key nav; `select.tsx` usa `focus:` em vez de `focus-visible:`; perdas dependem de fundo vermelho sem rótulo acessível explícito.

**Marina (Gestora em reunião):** Números animam antes de estabilizar; overview não responde "qual equipe puxa o funil?" sem comparar 3 cards manualmente; abreviações `Neg. perd.` ilegíveis a 3m; scroll horizontal interrompe weekly.

## Minor Observations

1. `DashboardFilter` força `border-white! bg-white!` no `SelectTrigger` — override frágil na navbar.
2. `dash-content::before` com 4 radial-gradients + `blur(38px)` é decoração pura.
3. `TeamTabNav` não carrega cor de `TEAM_ACCENT` — equipes visualmente idênticas na navegação.
4. `aria-live="polite"` só no chip de período; mudanças de KPI não são anunciadas.
5. `Card` tem dead code de faixa `h-0.5` no topo quando `accent` é passado — contradiz regra DESIGN.md.

## Questions to Consider

1. E se o dashboard abrisse sempre estático e só animasse com "Modo apresentação"?
2. E se acima da dobra existissem três números — Ativo, Perdas, Pico — e o resto fosse drill-down?
3. O `liquid-glass` na tabela justifica o custo de GPU numa reunião onde 90% do tempo está na grade?
