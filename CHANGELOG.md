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
