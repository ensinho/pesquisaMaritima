# Pesquisa Marítima

Descrição

Este repositório contém o código do projeto "Pesquisa Marítima". O projeto é majoritariamente escrito em TypeScript e inclui componentes de backend (APIs e lógica do servidor), frontend (cliente web) e scripts de banco de dados em PL/pgSQL. Este README foi atualizado para refletir a estrutura correta do repositório e as principais instruções de configuração e execução do backend.

Estrutura do repositório

A estrutura principal do repositório é a seguinte (exemplo):

- /backend            # Código do servidor (TypeScript)
  - /src              # Código-fonte do backend
  - /migrations       # Migrations do banco de dados (se houver)
  - /db               # Scripts SQL / PLpgSQL
  - package.json
  - tsconfig.json
- /frontend           # Código do cliente (TypeScript/React, etc.)
  - /src
  - package.json
- /scripts            # Scripts utilitários
- README.md

Se a estrutura do seu repo for diferente, ajuste os caminhos acima conforme necessário.

Backend — visão geral e ajustes necessários

O backend é escrito em TypeScript. As seguintes instruções e notas cobrem os ajustes comuns necessários ao configurar/rodar o backend:

Requisitos

- Node.js (versão LTS recomendada)
- npm ou yarn
- PostgreSQL (ou o banco de dados configurado no projeto)

Variáveis de ambiente (exemplo)

Crie um arquivo .env na raiz do backend (ou ajuste conforme sua configuração) com as variáveis essenciais:

DATABASE_URL=postgres://user:password@host:5432/database
PORT=3000
NODE_ENV=development
JWT_SECRET=uma_chave_secreta

Observações sobre banco de dados

- Se o projeto usar migrations, execute as migrations antes de iniciar a aplicação. Exemplos comuns:
  - npm run migrate
  - npm run typeorm:migration:run

- Caso o projeto use scripts PL/pgSQL (funções/stored procedures), eles normalmente estão em backend/db ou /migrations. Execute-os contra o banco (psql ou ferramenta equivalente) quando necessário:
  - psql $DATABASE_URL -f backend/db/funcao_exemplo.sql

Scripts comuns (exemplos)

Instalação:
- cd backend && npm install
- cd frontend && npm install

Desenvolvimento:
- cd backend && npm run dev        # start em modo hot-reload (ex: ts-node-dev, nodemon)
- cd frontend && npm start

Build & produção:
- cd backend && npm run build && npm start

Verifique package.json nos diretórios backend/frontend para os scripts exatos e ajuste os comandos acima conforme necessário.

Endpoints e documentação

- Documente os endpoints principais (ex: /api/auth, /api/pesquisas, /api/relatorios) no repositório ou use uma ferramenta como Swagger/OpenAPI.
- Indique na documentação quaisquer mudanças de API resultantes dos "ajustes de backend" (ex.: novas rotas, parâmetros alterados, autenticação modificada).

Checklist de ajustes de backend (sugestões)

- [ ] Confirmar e documentar a estrutura de pastas do backend.
- [ ] Atualizar scripts de start/build no package.json, se necessário.
- [ ] Conferir e documentar as migrations e scripts PL/pgSQL.
- [ ] Atualizar variáveis de ambiente e exemplos (.env.example).
- [ ] Rodar migrations em ambiente de desenvolvimento e confirmar integridade.
- [ ] Atualizar README com rotas/padrões de autenticação se algo mudou.

Contribuindo

Se você quiser contribuir com o projeto, por favor:

1. Abra uma issue descrevendo a proposta ou bug.
2. Crie um branch com prefixo feature/ ou fix/ a partir de main.
3. Abra um pull request descrevendo a mudança e como testar.

Licença

Especifique a licença do projeto (por exemplo MIT) ou mantenha a existente.

Contato

Para dúvidas, abra uma issue ou entre em contato com os mantenedores do repositório.

Notas finais

Este README foi reorganizado para dar uma visão clara da estrutura do projeto e para destacar os passos de configuração e os ajustes do backend. Ajuste caminhos e comandos conforme a realidade do repositório se estiverem diferentes do exemplo acima.