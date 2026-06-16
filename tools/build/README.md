# Build Tooling

Future home for Bazel or Bazel-style build integration.

This folder exists to make the roadmap explicit without pretending to have Google3 access. The first implementation should focus on reproducible local checks before adding heavier build orchestration.

Current scripts:

- `write-console-data.mjs`: runs the Data Cloud Agents demo and writes `apps/console/demo-data.json`.
- `serve-console.mjs`: serves the static console locally without extra dependencies.
