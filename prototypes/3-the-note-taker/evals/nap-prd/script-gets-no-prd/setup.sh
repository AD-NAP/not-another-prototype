#!/usr/bin/env bash
set -euo pipefail
mkdir -p docs
cat > docs/brief.md <<'BRIEF'
# Brief: to-webp

## The idea
A script that converts every PNG in a folder to WebP, to make my blog's images smaller.

## Who it's for and why
Me, before I publish a post. The images make the pages slow to load.

## Type
Script, because it does one job per run and keeps nothing between runs.

**Traits:** none

## How it's used
```
to-webp ./images
```
Input: a folder with `cover.png` and `chart.png`. Output: `cover.webp` and `chart.webp` beside them. The PNGs stay.

## Done when
- Running it on a folder writes a WebP next to every PNG.
- It skips a PNG that already has a WebP.

## Constraints
- Runs on my laptop.

## Docs plan
None. Build it: the example run becomes the README.

## Open questions
- None.
BRIEF
