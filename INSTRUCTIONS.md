# Instruções para rodar o projeto

1. Configure seu arquivo `.env` com as variáveis POSTGRES_USER, POSTGRES_PASSWORD e POSTGRES_DB.
2. Rode o container do banco com `docker-compose up -d`.
3. Execute as migrations com `npx knex migrate:latest`.
4. Execute os seeds com `npx knex seed:run`.
5. Inicie o servidor com `npm start`.