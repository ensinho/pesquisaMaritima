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
- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **Shadcn/ui** para componentes
- **React Router** para navegação
- **Tanstack Query** para gerenciamento de estado

### Backend & Database
- **Supabase** (PostgreSQL + Auth + Storage)
- **Row Level Security (RLS)** para segurança
- **Real-time subscriptions** para atualizações

### Ferramentas de Desenvolvimento
- **ESLint** para qualidade de código
- **PostCSS** para processamento CSS
- **Git** para controle de versão

## 📁 Estrutura do Projeto

```
PesquisaMaritima/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ui/             # Componentes base (Shadcn)
│   │   ├── EditColetaModal.tsx
│   │   ├── EditEmbarcacaoModal.tsx
│   │   ├── ConfirmDelete.tsx
│   │   └── ...
│   ├── hooks/              # Hooks customizados
│   │   ├── useColetas.ts   # CRUD de coletas
│   │   ├── useEmbarcacoes.ts # CRUD de embarcações
│   │   ├── useFavoritos.ts
│   │   └── ...
│   ├── pages/              # Páginas da aplicação
│   │   ├── Home.tsx        # Dashboard principal
│   │   ├── MinhasColetas.tsx # Gestão pessoal de coletas
│   │   ├── NovaColeta.tsx  # Formulário de nova coleta
│   │   ├── Catalog.tsx     # Catálogo público
│   │   ├── Admin.tsx       # Painel administrativo
│   │   └── ...
│   ├── integrations/       # Configurações de integração
│   │   └── supabase/
│   └── lib/                # Utilitários
└── supabase/               # Configurações do banco
    └── migrations/         # Migrações SQL
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
- **Sanitização de dados** para prevenir XSS

## 🌐 Estados da Aplicação

### Usuário Não Autenticado
- Página de apresentação do sistema
- Formulário de login/cadastro
- Redirecionamento automático

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