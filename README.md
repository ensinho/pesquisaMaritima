# About

Pesquisa Marítima is an open-source web app that makes maritime information easy to find, understand, and act on. It brings vessel, port, route, and environmental context into a fast, searchable interface so researchers, students, and professionals can answer maritime questions without wrestling with fragmented data and clunky tools.

Live: https://pesquisa-maritima.vercel.app/

<div align="center">

<!-- Tech badges (simple, visual) -->
<a href="https://www.typescriptlang.org/">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
</a>
<a href="https://react.dev/">
  <img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
</a>
<a href="https://tailwindcss.com/">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-0EA5E9?style=for-the-badge&logo=tailwindcss&logoColor=white">
</a>
<a href="https://supabase.com/">
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=222">
</a>
<a href="https://www.postgresql.org/">
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white">
</a>
<a href="https://vercel.com/">
  <img alt="Vercel" src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white">
</a>

</div>

---

## Why it exists ❓
Maritime data is scattered across sources and often hard to query. Public datasets vary in format and freshness, and most tools are either too limited or too heavyweight. Pesquisa Marítima focuses on the core workflow—search and exploration—delivering a modern, browser-first experience that grows with community needs.

## Who it's for 👥
- Researchers and students exploring maritime activity, trade flows, and safety
- Port/logistics analysts tracking port calls and operational patterns
- Journalists and NGOs investigating coastal activity and compliance
- Developers/data folks who want a clean API and schema to build on

## What you can do 🔎
- Unified search across key entities (vessels, ports, routes)
- Entity profiles with the most relevant fields up front
- Fast, faceted filtering by type, flag, time range, and more
- Saved searches (repeat and share read-only links)
- CSV/JSON export and simple integration hooks

## Data approach 🗄️
- Postgres (Supabase) hosts curated/normalized records with SQL/PLpgSQL views for fast queries
- Modular domains: start with ports/port calls and add entities as datasets become available
- Designed for scheduled ingestion and materialized views for performance vs. freshness

## Tech 🧰
- Frontend: TypeScript + React
- Styling: Tailwind CSS
- Data/auth: Supabase (Postgres + PL/pgSQL)
- Hosting: Vercel

## Roadmap (high-level) 🗺️
- MVP: search + profiles, filters, saved searches, export
- Data/perf: ingestion tasks, materialized views, freshness metadata
- UX: shareable views, lightweight maps, i18n (pt-BR and en)
- Advanced: watchlists/alerts, team roles, simple public API

## Contributing 🤝
Issues and PRs are welcome—especially for new data sources, schema evolution, query performance, and UX. Check the [Issues](https://github.com/ensinho/pesquisaMaritima/issues) tab to get started.

---

## Sobre (PT-BR)

<div align="center">

<a href="https://www.typescriptlang.org/">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" >
</a>
<a href="https://react.dev/">
  <img alt="React" src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB">
</a>
<a href="https://tailwindcss.com/">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-0EA5E9?style=flat-square&logo=tailwindcss&logoColor=white" >
</a>
<a href="https://supabase.com/">
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=222">
</a>
<a href="https://www.postgresql.org/">
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white">
</a>
<a href="https://vercel.com/">
  <img alt="Vercel" src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white">
</a>

</div>

Pesquisa Marítima é um app web open-source para buscar e explorar informações do ecossistema marítimo (navios, portos, rotas e contexto ambiental) com rapidez e clareza. A ideia é reduzir a fragmentação de dados e oferecer uma experiência moderna e simples para pesquisa, análise e relatórios.

Ao que se propõe:
- Busca unificada e perfis de entidades (ex.: navio, porto)
- Filtros rápidos (tipo, bandeira, período, etc.)
- Buscas salvas, compartilhamento por link e exportação (CSV/JSON)
- Abordagem modular de dados (comece por portos/port calls, expanda com novos conjuntos)


Roteiro: MVP com busca, perfis, filtros, buscas salvas e exportação; ingestão de dados públicos com normalização e views materializadas; mapas leves; i18n; alertas e API pública no futuro.
