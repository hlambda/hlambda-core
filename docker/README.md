# Supported Tags

- `<version>`, `latest`

# Quick reference

- Where to get help: the [Hyper Lambda Discord Server](https://discord.gg/hlambda) or [Stack Overflow](https://stackoverflow.com/questions/tagged/hlambda)
- Where to file issues: https://github.com/hlambda/hlambda-core
- Supported architectures: amd64, arm64
- Where are the docs: https://hlambda.io

# What is Hlambda [Hyper Lambda]

Hlambda is easy to manage, meta ECMAScript API server, with console UI and CLI tool.

Your ECMAScript metadata payload is the configuration of the (Hyper Lambda) Hlambda Server.

![Hlambda Banner](https://raw.githubusercontent.com/hlambda/hlambda-core/master/public/static/images/hlambda-logo-banner-blue.png)

# How to use this image

### Stand-alone Server

To run Hlambda in docker as a stand-alone server instance you can run:

```
docker run -d -p 8081:1331 --env HLAMBDA_ADMIN_SECRET=demo --name hlambda-server --restart=always -v hlambda_metadata:/usr/src/app/metadata hlambda/hlambda-core:latest
```

This will:

- Run a new container named: hlambda-server
- Run the latest hlambda server on host port: 8081
- Set the hlambda server admin secret to: `demo`
- Create a volume for your metadata named: hlambda_metadata

Hlambda Console will be available at `http://localhost:8081`.

### Docker Compose Stack with [Hasura](https://hasura.io) <3 and Postgres <3

To run Hlambda in the docker stack with Postgres and [Hasura](https://hasura.io) you can run:

```
  curl https://www.hlambda.io/raw/code/start/docker-compose.yaml -o docker-compose.yaml && docker compose up -d
```

This will:

- Download the `docker-compose.yaml` file (Warning: please read the contents of the YAML file to understand what you are actually running)
- Run a new docker-compose stack

# License

View [license information](https://github.com/hlambda/hlambda-core/blob/master/LICENSE.md) for the software contained in this image.

As with all Docker images, these likely also contain other software which may be under other licenses (such as Bash, etc from the base distribution, along with any direct or indirect dependencies of the primary software being contained).
