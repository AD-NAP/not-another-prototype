#!/usr/bin/env bash
set -euo pipefail
# Run through bash so the script works even when Git drops the execute bit (commits from Windows).
exec bash "$(dirname "$0")/../_fixtures/scaffold-common.sh" "$(dirname "$0")/fixtures"
