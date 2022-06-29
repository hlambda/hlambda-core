# Todo

- Default GET /healthz if does not exist.

# Release 0.0.8

- Added CHANGELOG.md
- Fix issue with serving static content. (Now you can serve static content on root by disabling root redirect to console via HLAMBDA_DISABLE_INITIAL_ROUTE_REDIRECT="true" )
- Add example for the static serving of the content because `__dirname` is not available, `fileURLToPath(import.meta.url);` should be used.
- Add version build number route. (GET /build-number)
- Add timestamp to docker image on build `./image-build-timestamp.txt`
