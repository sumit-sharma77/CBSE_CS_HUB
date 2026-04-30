#!/usr/bin/env bash
# Smoke test — runs against a deployed API
# Usage: SMOKE_URL=https://api.cbsecshub.com ./smoke-test.sh
# Or:    ./smoke-test.sh http://localhost:8080

BASE_URL="${SMOKE_URL:-${1:-http://localhost:8080}}"
PASS=0
FAIL=0

check() {
  local description=$1
  local url=$2
  local expected_status=$3

  actual=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  if [ "$actual" == "$expected_status" ]; then
    echo "  ✅  $description ($actual)"
    ((PASS++))
  else
    echo "  ❌  $description (expected $expected_status, got $actual)"
    ((FAIL++))
  fi
}

echo "=== Smoke Test: $BASE_URL ==="
check "Health check"          "$BASE_URL/actuator/health"          "200"
check "Plans (public)"        "$BASE_URL/api/v1/plans"             "200"
check "Auth protected route"  "$BASE_URL/api/v1/users/me"          "401"
check "Webhook 401 no sig"    "$BASE_URL/api/v1/webhooks/razorpay" "400"

echo ""
echo "Results: $PASS passed, $FAIL failed"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
