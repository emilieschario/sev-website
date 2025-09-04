#!/usr/bin/env bash
set -euo pipefail

echo "Running static content checks..."

assert_file() {
  local path="$1"; shift
  if [[ ! -f "$path" ]]; then
    echo "ERROR: Missing file: $path" >&2
    exit 1
  fi
  if [[ ! -s "$path" ]]; then
    echo "ERROR: Empty file: $path" >&2
    exit 1
  fi
}

assert_contains() {
  local path="$1"; local pattern="$2"
  if ! grep -qiE "$pattern" "$path"; then
    echo "ERROR: Expected pattern not found in $path: $pattern" >&2
    exit 1
  fi
}

# Home page
assert_file index.html
assert_contains index.html "Making things that just|SEV"

# Floss Drop landing
assert_file floss-drop.html
assert_contains floss-drop.html "YOUR DENTIST"
assert_contains floss-drop.html "Floss picks .*are.* better"

# 404 and redirect presence
assert_file 404.html
assert_file floss-drop/index.html

echo "All static content checks passed."


