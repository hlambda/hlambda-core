# Hlambda (/hlæmdə/; hλ;)

## What is Hlambda (/hlæmdə/)

Hlambda is ECMAScript meta API service. That means that it offers simple ways to deploy ECMAScript code to local or remote servers.

It is the implementation of the idea to load your ECMAScript code as configuration (metadata). With Hlambda you can easily create a microservice that can load arbitrary code configuration.

The main use case was to implement a stateless REST microservice that will run Hasura custom actions in a separate container, containing any custom business logic.

For more details check ["Getting started"](https://www.hlambda.io/getting-started/).

In production deployments, you can bake metadata and disable the UI console.

## What it can do, and for what it was intended

- Stateless REST Service. (Designed to do)
- Offer custom business logic to awesome Hasura GraphQL Server. (Designed to do)
- Hasura GraphQL Server authorization hook. (Designed to do)
- Process Webhooks, and call other APIs (Apple subscriptions, Stripe). (Designed to do)
- Encryption, JWT signing or validation.
- Cron jobs.
- File transformation, conversion service.
- Serving static files.
- Serving frontend artifacts.
- Fast prototyping. (For hackathons, etc.)
- Your own GraphQL Service.
- Remote debugging.
- Anything that you can think of...

## How to use it

You can check ["Getting started"](https://www.hlambda.io/getting-started/) on how to get started with Hlambda. In short, it goes like this:

- Install latest hlambda CLI. (Hint: `npm i -g hlambda-cli`)
- Spin up the Docker instance of the Hlambda server. (Hint: Use `hl snip d` to get docker snippet)
- Use CLI to generate a new Hlambda app. (Hint: `hl init my-app`)
- (Optional) Configure multiple environments. (Hint: `hl env add staging`)
- Deploy metadata (Hint: `hl m a`)
- Test your endpoints :) (Hint: `hl r g demo`)

## Known issues

- Importing npm packages that are used by the Hlambda Core like;

  - "colors": "1.4.0",
  - "hlambda": "^0.0.3",

can cause known issues... like the disabling inherited colors prototype chain unless FORCE_COLOR is set to true.

Exporting errors in hlambda if imported can also cause it to not be visible in the list of errors or constants on the hlambda server.

Until addressed this has a simple hotfix to just remove that package from the list of dependencies in your hlambda app, before applying metadata.

## NOTICE

```
Any contributions are greatly appreciated.
```

## Authors

Gordan Nekić <gordan@neki.ch>

## How to support the project

I've recently created Patreon that will enable me to work more on the Hlambda services.

<span class="badge-patreon"><a href="https://www.patreon.com/bePatron?u=70751523" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-green.svg" alt="Patreon donate button" /></a></span>
