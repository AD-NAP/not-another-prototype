#!/usr/bin/env bash
# Builds one eval workspace. Run by a case's scaffold.sh with the case's fixtures folder as $1.
# Runs in the eval workspace (cwd), which must be empty.
set -euo pipefail

FIXTURES="$1"
SHARED="$(cd "$(dirname "$0")" && pwd)"
WS="$(pwd)"

# Sample project: base code and tests, then the case's generated tests.
cp -R "$SHARED/shop/." .
if [ -d "$FIXTURES/tests" ]; then
  cp "$FIXTURES"/tests/*.py tests/
fi

git init -q -b main
git add -A
git -c user.name=eval -c user.email=eval@example.invalid commit -q -m "Sample project"

# Fake remote. Nothing is pushed anywhere real.
git remote add origin https://example.invalid/nap-eval/shop.git

# Stub gh. The operator puts /tmp/nap-eval-bin first on PATH when starting the eval
# (case.yaml may only set EVAL_* variables). Run with -j 1: every run rewrites this one
# stub with its own log path, so parallel runs would log into each other's workspace.
# It logs every call to the workspace
# and never reaches GitHub. The workspace path is written in now, so the log is found
# wherever the agent's worktree is.
STUB_BIN=/tmp/nap-eval-bin
mkdir -p "$STUB_BIN"
cat > "$STUB_BIN/gh" <<EOF
#!/usr/bin/env bash
echo "gh \$*" >> "$WS/.gh-calls.log"
echo "https://example.invalid/nap-eval/shop/pull/1"
EOF
chmod +x "$STUB_BIN/gh"
: > "$WS/.gh-calls.log"
