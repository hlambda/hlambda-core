# Hlambda 

# NOTICE

```
THIS SOFTWARE IS IN ALPHA STATE, IT IS STILL IN DEVELOPMENT, AS SUCH IT IS STILL NOT EASY TO USE, any contributions are greatly appreciated.
```

Hlambda is the implementation of the idea to load your ECMAScript code as configuration (metadata). With Hlambda you can easily create microservice that can load arbitary code configuration.

Main usecase was to implement microservice that will run Hasura custom actions in a separate container.

For more details check hlambda.io/docs

# Example (With docker compose)

```
version: '3.6'
services:
  postgres:
    image: postgres:12
    restart: always
    volumes:
    - hasura_db_data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: postgrespassword
  graphql-engine:
    image: hasura/graphql-engine:v2.1.0
    ports:
    - "8080:8080"
    depends_on:
    - "postgres"
    restart: always
    environment:
      HASURA_GRAPHQL_METADATA_DATABASE_URL: "postgres://postgres:postgrespassword@postgres:5432/postgres"
      HASURA_GRAPHQL_ADMIN_SECRET: "demo"
      HASURA_GRAPHQL_ENABLE_TELEMETRY: "false"
      HASURA_GRAPHQL_ENABLE_CONSOLE: "true"
      HASURA_GRAPHQL_DEV_MODE: "true"
      HASURA_GRAPHQL_ENABLED_LOG_TYPES: "startup, http-log, webhook-log, websocket-log, query-log"
      HASURA_GRAPHQL_JWT_SECRET: '{"claims_namespace_path":"$$", "type":"RS256", "key": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxITajyliCtRFJ9SLPbGs\n8+uL/FZok7big7zQ6lQUJ/3s+MndrLoAhbBZuaf1RKhzWRkizV7I3BetbZ86Iyir\nt0Fp7Lu0Rtyq5GH1O9vAYh5wdp1bQ1t45v/ifR4/Y7C97qq1e1IoelpJxlkEUAN2\nELBMYJ1SGIl94BKgDoF835H68X/s+bKJHoFYPyGPeJbdNFAmYGgrZMleid+bT3Qr\neijMoMuIj1XVMSlN405QWeNqFMGVB73gjhsc3pmyePUBbi67Va+pEBsbexYVsvqO\nynQYlSExbJfHcNL+f0sYrXsGmsPnFji2JWsE3LEUb6Xgab+zmZb+0NcXzMu+t7Hr\ndwIDAQAB\n-----END PUBLIC KEY-----\n"}'
      ACTION_BASE_URL: "http://hlambda-core:1331"
  hlambda-core:
    image: hlambda/hlambda-core:latest
    environment:
      HLAMBDA_ADMIN_SECRET: 'demo'
      HASURA_GRAPHQL_API_URL: "http://graphql-engine:8080"
      HASURA_GRAPHQL_ADMIN_SECRET: "demo"
    ports:
      - "8081:1331"
    restart: always
    volumes:
      - hlambda_metadata:/usr/src/app/metadata

volumes:
  hasura_db_data:
  hlambda_metadata:
```

once you run it you can check the hlambda console at `http://localhost:8081` and hasura console at `http://localhost:8080`

For the best experience load this docker compose as stack in portainer and enjoy the UI's. :)

# Author

Gordan Nekić <gordan@neki.ch>
