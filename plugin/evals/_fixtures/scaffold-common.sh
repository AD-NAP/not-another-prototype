#!/usr/bin/env bash
# Builds one Engineer eval workspace. Run by a case's scaffold.sh with the case's fixtures folder as $1.
# Runs in the eval workspace (cwd), which starts empty. Files and git state only.
set -euo pipefail

FIXTURES="$1"
SHARED="$(cd "$(dirname "$0")" && pwd)"

# Sample project, then the case's generated tests.
cp -R "$SHARED/shop/." .
if [ -d "$FIXTURES/tests" ]; then
  cp "$FIXTURES"/tests/*.py tests/
fi

git init -q -b main
git add -A
git -c user.name=eval -c user.email=eval@example.invalid commit -q -m "Sample project"
