# Release 0.3.2

- Fixes the version bump issue.
- Updated README.md
- GitOps, remote repository sync.
- Tab complete in Hlambda Pseudo Terminal

# Release 0.3.1

- Fix the CORS issue with the vscode when requesting external data from vscode-unpkg CDN.
- Fix the issue with Webpack miss-configuration that was wrapping dist and src folder instead of only dist.

# Release 0.3.0

- Added zero downtime reload.
- Added fully featured vscode for editing metadata in Console UI
- Added pre-installed Hlambda extension to custom vscode build.
- Added pre-installed Hasura extension to custom vscode build.
- Added pre-installed Color-Vision extension to custom vscode build.
- Updated Console UI. Home page now shows both logs and Swagger UI.
- Added support for saving request history, added replay option for the requests saved in request history.
- Replaced terminal with vscode pseudo terminal.
- Updated to new Hlambda logo.
- Updated favicon.

# Release 0.2.0

- Updated Console UI (Logs: Auto scroll snap, Metadata: Action history dates)
- Added example for use of constants in default metadata.
- Added support for parsing cookies.
- Added example to get and set cookies in default metadata.
- Added ACL for Non-public Swagger UI in Console.
- Fix HLAMBDA_LIST_OF_PROTECTED_ENV_VARIABLES, also add SERVER_PORT to HLAMBDA_LIST_OF_PROTECTED_ENV_VARIABLES.
- Added support to get request raw body via new env variable `EXPRESS_BODY_PARSER_INCLUDE_RAW_BODY` default:false
- Added Hasura Custom Action Middleware that checks for Hasura Web Hook Secret in request header to the example metadata.

# Release 0.1.0

- Added support for JSON output to stdout, new env variable `JSON_STDOUT` default:false
- Restructured metadata example location, moved examples to `./data/metadata-examples`
- Added ability to reset metadata, which will reset metadata to initial image example metadata.
- Updated UI
- Bugfixes

# Release 0.0.9

- Added metadata history
- Added support for socket.io and any module that needs reference to the server instance.
- Improved Console UI
- Bugfixes
- Enable file upload through console
- Added more examples to the initial metadata

# Release 0.0.8

- Added CHANGELOG.md
- Fix issue with serving static content. (Now you can serve static content on root by disabling root redirect to console via HLAMBDA_DISABLE_INITIAL_ROUTE_REDIRECT="true" )
- Add example for the static serving of the content because `__dirname` is not available, `fileURLToPath(import.meta.url);` should be used.
- Add version build number route. (GET /build-number)
- Add timestamp to docker image on build `./image-build-timestamp.txt`
- Add GET /healthz route
- Add CORS env variable `HLAMBDA_CORS_DOMAIN`, by default Hlambda server continues to allow '\*'
