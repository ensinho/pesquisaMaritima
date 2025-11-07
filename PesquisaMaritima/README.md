# AquaCensus - Sistema de Pesquisa Marítima

## 🌊 Visão Geral

O **AquaCensus** é um sistema moderno e completo para catalogação de espécies marinhas, desenvolvido especialmente para pesquisadores do laboratório DIPEMAR. O sistema permite o registro, gerenciamento e análise de coletas de espécies marinhas, oferecendo uma plataforma colaborativa para pesquisa científica.

## 🎯 Objetivo

Centralizar e digitalizar o processo de catalogação de espécies marinhas, facilitando:
- **Documentação científica** de coletas de campo
- **Colaboração** entre pesquisadores
- **Análise de dados** e estatísticas de pesquisa
- **Preservação digital** do conhecimento científico

## ✨ Principais Funcionalidades

### 🐟 Gestão de Coletas (CRUD Completo)
- **Criar**: Registre novas coletas com informações detalhadas
- **Visualizar**: Explore o catálogo completo de espécies
- **Editar**: Atualize informações de suas coletas existentes
- **Excluir**: Remova coletas com confirmação de segurança

### 🚢 Gestão de Embarcações (CRUD Completo)  
- **Cadastrar**: Registre embarcações utilizadas nas coletas
- **Gerenciar**: Edite e exclua embarcações (área administrativa)
- **Associar**: Vincule coletas às embarcações correspondentes

### 📊 Sistema de Usuários e Permissões
- **Autenticação segura** com Supabase Auth
- **Perfis personalizados** com informações dos pesquisadores
- **Controle de acesso** (usuários comuns e administradores)
- **Gestão de laboratórios** e embarcações (administradores)

### 🔍 Pesquisa e Filtros
- **Busca inteligente** por nome científico, comum ou local
- **Filtros avançados** para análise de dados
- **Visualização otimizada** com cards informativos

### ❤️ Sistema de Favoritos
- **Marque coletas** de interesse especial
- **Acesso rápido** às espécies favoritas
- **Organização personalizada** do conteúdo

### 📈 Estatísticas e Analytics
- **Dashboard personalizado** com estatísticas do usuário
- **Gráficos interativos** de coletas por período
- **Métricas de contribuição** individual

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** + **TypeScript** - Interface moderna e tipada
- **Vite** - Build tool rápido e otimizado
- **Tailwind CSS** - Estilização utility-first
- **Shadcn/ui** - Componentes acessíveis
- **React Router** - Navegação SPA

### Backend
- **Node.js** + **Express** - API REST robusta
- **TypeScript** - Desenvolvimento tipado
- **Supabase Client** - Integração com banco

### Database & Auth
- **Supabase** (PostgreSQL)
- **Row Level Security (RLS)**
- **Supabase Auth** - Autenticação segura
- **Real-time subscriptions**

### Deploy & DevOps
- **Vercel** - Deploy fullstack automático
- **GitHub** - Controle de versão e CI/CD
- **Environment Variables** - Configuração segura

### Desenvolvimento
- **ESLint** + **Prettier** - Qualidade de código
- **PostCSS** - Processamento CSS avançado

## 📁 Arquitetura do Sistema

### Estrutura Frontend
```
src/
├── components/
│   ├── ui/                 # Shadcn/ui components
│   ├── EditColetaModal.tsx # Modal de edição
│   ├── RealtimeUpdates.tsx # Atualizações em tempo real
│   └── UserStatistics.tsx  # Dashboard de estatísticas
├── hooks/
│   ├── useColetas.ts       # CRUD de coletas
│   ├── useEmbarcacoes.ts   # Gestão de embarcações
│   ├── useFavoritos.ts     # Sistema de favoritos
│   └── useStatistics.ts    # Métricas e analytics
├── pages/
│   ├── Home.tsx           # Dashboard principal
│   ├── MinhasColetas.tsx  # Minhas coletas (CRUD)
│   ├── NovaColeta.tsx     # Formulário de criação
│   ├── Catalog.tsx        # Catálogo público
│   ├── Admin.tsx          # Painel administrativo
│   ├── Auth.tsx           # Autenticação
│   └── Profile.tsx        # Perfil do usuário
├── services/
│   └── api.ts             # Cliente HTTP configurado
└── integrations/
    └── supabase/          # Configuração Supabase
```

### Estrutura Backend
```
pesquisaMaritima-backend/
├── src/
│   ├── controllers/       # Lógica de negócio
│   │   ├── coletasController.ts
│   │   ├── embarcacoesController.ts
│   │   ├── laboratoriosController.ts
│   │   └── favoritosController.ts
│   ├── routes/           # Definição de rotas
│   │   ├── coletasRoutes.ts
│   │   ├── embarcacoesRoutes.ts
│   │   └── index.ts
│   ├── models/           # Models do Supabase
│   │   ├── Coleta.ts
│   │   ├── Embarcacao.ts
│   │   └── Laboratorio.ts
│   ├── config/
│   │   └── supabase.ts   # Configuração do cliente
│   └── server.ts         # Servidor Express
├── dist/                 # Build compilado
├── vercel.json          # Configuração Vercel
└── package.json
```

### Database Schema (Supabase)
```sql
-- Tabelas principais
├── profiles              # Perfis de usuários
├── laboratorios         # Laboratórios de pesquisa
├── embarcacoes          # Embarcações para coleta
├── coletas              # Registros de coletas
└── favoritos            # Sistema de favoritos

-- Funções customizadas
├── get_user_collection_stats()  # Estatísticas por usuário
└── get_coletas_with_details()   # Coletas com joins
```

## 🚀 Funcionalidades Detalhadas

### 1. Sistema de Coletas
- **Formulário completo** com validação
- **Upload de até 3 fotos** por coleta
- **Dados científicos**: nome científico, comum, coordenadas GPS
- **Métricas**: comprimento, peso, observações
- **Associação** com embarcações e laboratórios

### 2. Gerenciamento Pessoal
- **"Minhas Coletas"**: visualize e gerencie suas contribuições
- **Edição inline**: modifique dados diretamente
- **Exclusão segura**: confirmação antes de remover
- **Histórico completo**: todas as coletas ordenadas por data

### 3. Painel Administrativo
- **Gestão de laboratórios**: adicionar, editar, remover
- **Gestão de embarcações**: CRUD completo
- **Controle de usuários**: visualizar perfis e permissões
- **Moderação de conteúdo**: supervisionar coletas

### 4. Experiência do Usuário
- **Interface responsiva**: funciona em desktop, tablet e mobile
- **Tema moderno**: design aquático com gradientes
- **Navegação intuitiva**: menu claro e acessível
- **Feedback visual**: notificações e estados de loading

## 🔒 Segurança

- **Autenticação robusta** via Supabase Auth
- **Row Level Security** no banco de dados
- **Validação de entrada** em todas as operações
- **Controle de permissões** por função de usuário

## 🌐 Estados da Aplicação

### Usuário Comum
- Dashboard pessoal com estatísticas
- Criar e gerenciar coletas pessoais
- Explorar catálogo completo
- Sistema de favoritos

### Administrador
- Todas as funcionalidades de usuário comum
- Painel administrativo completo
- Gestão de embarcações e laboratórios
- Moderação de conteúdo

## 🔄 Fluxos Principais

### Fluxo de Nova Coleta
1. Usuário acessa "Nova Coleta"
2. Preenche formulário detalhado
3. Adiciona fotos (opcional)
4. Seleciona embarcação
5. Salva com validação
6. Confirmação de sucesso

### Fluxo de Edição
1. Usuário acessa "Minhas Coletas"
2. Clica em "Editar" na coleta desejada
3. Modal abre com dados pré-preenchidos
4. Modifica informações necessárias
5. Salva alterações
6. Confirmação de atualização

### Fluxo de Exclusão
1. Usuário clica em "Excluir"
2. Modal de confirmação aparece
3. Confirma ação de exclusão
4. Registro removido permanentemente
5. Lista atualizada automaticamente

**AquaCensus** 