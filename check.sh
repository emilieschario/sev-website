#!/bin/sh
set -e
apex=https://shouldexistventures.com
www=https://www.shouldexistventures.com

check() {
  url="$1"
  code=$(curl -sSIL "$url" -o /dev/null -w "%{http_code}") || code=000
  echo "$url -> $code"
}

check http://shouldexistventures.com || true
check http://www.shouldexistventures.com || true
check "$apex" || true
check "$www" || true
