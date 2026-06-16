# Quality Tooling

Repository-wide quality checks for the public demo.

Planned checks:

- tests
- lint/type checks
- docs completeness
- public-safety redaction
- release handoff completeness

Current check:

```bash
npm run quality
```

It validates the architecture blueprint, runs the end-to-end public demo, and scans text/code files for obvious secret patterns or unverifiable Google3 claims.
