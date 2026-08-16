# @airdev/next

Generator package for Airdev-style Next.js apps.

## Build

This package does not own a runtime library anymore. Its build step pulls managed and seeded files from `barebone-next` by running this package's `scripts/extract.mjs` against that source repo.

The source repo is resolved in this order:

1. `BAREBONE_NEXT_REPO_PATH`
2. `AIRDEV_NEXT_SOURCE_REPO_PATH`
3. `../../repos/barebone-next` relative to this package

Build the package resources with:

```bash
npm run build
```

That rebuilds:

- `resources/required`
- `resources/optional`

and writes the extraction log to `tmp/extract.log`.

## Generate

From a consumer app root:

```bash
airdev-next
```

Generation behavior:

- files in `resources/required` overwrite existing files
- files in `resources/optional` are created only when missing
