# Product

## Register

Dashboard Litoralize

## Users

Gestores comerciais, líderes de equipe e diretoria da **Superintendência Jordão** (imobiliário / vendas). Usam o painel em reunião de panorama — projetor ou notebook, tempo curto, pressão por decisão. Precisam ver volume de leads, distribuição por fase e desempenho por corretor sem abrir o Bitrix.

## Product Purpose

Dashboard operacional que consolida leads do Bitrix (webhook) por mês de criação, equipes no CRM (Elite / Líder / Total e subequipes da esteira Econômico), fase do funil e corretor. Sucesso = em poucos segundos saber onde está o volume, onde estão as perdas e quem carrega cada etapa — sem planilha paralela.

Identidade **Litoralize**: logo, tema azul escuro e contexto da Superintendência Jordão.

## Brand Personality

Direta · analítica · focada.

Tom de sala de guerra comercial: números legíveis, hierarquia clara, zero teatro. Confiança vem da precisão dos dados e da separação explícita entre funil ativo e perdas — não de ornamentação.

Identidade visual: **azul escuro**, marca **Litoralize** na entrada e contexto organizacional **Jordão**.

## Anti-references

- CRM genérico roxo / indigo-on-white (HubSpot-clone, “SaaS starter”)
- Painéis crypto / neon glow / glassmorphism decorativo
- Grids de cards idênticos com ícone + título + texto
- Eyebrows uppercase em toda seção
- Templates Lovable/shadcn “hero metric” sem densidade de dados real

## Design Principles

1. **Dados antes de decoração** — cada pixel serve leitura de funil, mês ou corretor.
2. **Perdas à parte** — Negócios Perdidos e Prazos Perdidos nunca competem visualmente com o funil ativo.
3. **Mês vazio é informação** — ausência de leads aparece em branco; não inventar preenchimento.
4. **Corretor como unidade** — foto + nome + etapas; ranking sem perder o detalhe por fase.
5. **Familiaridade de ferramenta** — densidade e controles previsíveis; a UI some na tarefa.

## Accessibility & Inclusion

Meta WCAG 2.2 AA em contraste de texto e controles. Respeitar `prefers-reduced-motion`. Cores de fase não são o único canal de significado (rótulos e valores numéricos sempre presentes). Tabelas com scroll horizontal em telas estreitas; foco visível em filtros e abas.

## Deploy & infraestrutura

| Item | Valor |
|------|-------|
| Repositório | [github.com/RafaelADSdev/Dashboard-Litoralize](https://github.com/RafaelADSdev/Dashboard-Litoralize) |
| Produção | [dashboard-litoralize.vercel.app](https://dashboard-litoralize.vercel.app) |
| Auth / acesso | Supabase |
| Bitrix | Webhook REST (`BITRIX_WEBHOOK_URL`) |
