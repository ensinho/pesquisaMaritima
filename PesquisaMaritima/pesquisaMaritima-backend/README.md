# Pesquisa Marítima Backend

```
pesquisaMaritima-backend
├── src
│   ├── controllers          # Contains controllers for handling requests
│   ├── routes               # Defines API routes
│   ├── models               # Contains data models
│   ├── middleware           # Middleware functions for authentication and validation
│   ├── config               # Configuration files for database and services
│   ├── types                # TypeScript types and interfaces
│   └── app.ts               # Entry point of the application
├── package.json             # NPM package configuration
├── tsconfig.json            # TypeScript configuration
├── .env.example             # Example environment variables
├── .gitignore               # Git ignore file
└── README.md                # Project documentation
```
- **Coletas**
  - `GET /coletas` - Retrieve all collections
  - `GET /coletas/:id` - Retrieve a specific collection by ID
  - `POST /coletas` - Create a new collection
  - `PUT /coletas/:id` - Update an existing collection
  - `DELETE /coletas/:id` - Delete a collection

- **Embarcacoes**
  - `GET /embarcacoes` - Retrieve all boats
  - `GET /embarcacoes/:id` - Retrieve a specific boat by ID
  - `POST /embarcacoes` - Create a new boat
  - `PUT /embarcacoes/:id` - Update an existing boat
  - `DELETE /embarcacoes/:id` - Delete a boat