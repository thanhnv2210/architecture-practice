#!/bin/bash
# Build all com.singtel.ml projects in dependency order
# Output: ./tmp/gradle_build_history.log

WS="/Users/ThanhNguyen/CurrentWS"
LOG="/Users/ThanhNguyen/AI_WS/architecture-practice/tmp/gradle_build_history.log"
FAILED=()
PASSED=()

# Clear previous log
> "$LOG"

log() {
    echo "$1" | tee -a "$LOG"
}

build() {
    local project="$1"
    local publish="${2:-true}"   # pass "false" for services that don't need publishToMavenLocal
    local dir="$WS/$project"

    log "[$(date '+%Y-%m-%d %H:%M:%S')] START:   $project"

    if [ ! -d "$dir" ]; then
        log "[ERROR] Directory not found: $dir"
        FAILED+=("$project (directory missing)")
        return 1
    fi

    if [ ! -f "$dir/gradlew" ]; then
        log "[ERROR] gradlew not found in $dir"
        FAILED+=("$project (no gradlew)")
        return 1
    fi

    if [ "$publish" = "true" ]; then
        # Libs/APIs: publish to local Maven, skip bootJar if it exists (not needed for libs)
        local extra_flags=""
        if "$dir/gradlew" -p "$dir" tasks --all 2>/dev/null | grep -q "^bootJar "; then
            extra_flags="-x bootJar -x bootRun"
        fi
        "$dir/gradlew" -p "$dir" build publishToMavenLocal $extra_flags > /tmp/gradle_last.log 2>&1
    else
        # Services: just build (bootJar runs normally, no publish needed)
        "$dir/gradlew" -p "$dir" build > /tmp/gradle_last.log 2>&1
    fi
    local rc=$?

    if [ $rc -eq 0 ]; then
        log "[$(date '+%Y-%m-%d %H:%M:%S')] SUCCESS: $project"
        PASSED+=("$project")
    else
        log "[$(date '+%Y-%m-%d %H:%M:%S')] FAILED:  $project (exit code $rc)"
        # Append only the error cause, not full output
        grep -E "What went wrong|Could not find|Could not resolve|error:" /tmp/gradle_last.log | head -5 | sed 's/^/    /' >> "$LOG"
        FAILED+=("$project")
    fi

    return $rc
}

# ── TIER 1: Plugin + Root lib ─────────────────────────────────────────────────
log "### TIER 1: Plugin + Root lib"
build "ml-plugin"        || exit 1
build "ml-hmac-lib"      || exit 1

# ── TIER 2: Adapter libs (depend only on ml-hmac-lib) ────────────────────────
log ""
log "### TIER 2: Adapter libs"
build "telepin-adapter-lib"   || exit 1
build "wu-adapter-lib"        || exit 1
build "tranglo-adapter-lib"   || exit 1
build "netsclick-adapter-lib" || exit 1
build "forter-adapter-lib"    || exit 1
build "sma-adapter-lib"       || exit 1

# ── TIER 3: API modules (depend only on ml-hmac-lib) ─────────────────────────
log ""
log "### TIER 3: API modules"
build "ml-auth-api"     || exit 1
build "ml-payment-api"  || exit 1
build "ml-fx-api"       || exit 1
build "ml-product-api"  || exit 1
build "ml-utility-api"  || exit 1
build "ml-portal-api"   || exit 1

# ── TIER 4: Cross-dependent libs/APIs ────────────────────────────────────────
log ""
log "### TIER 4: Cross-dependent libs/APIs"
build "ml-remittance-api"  || exit 1
build "thunes-adapter-lib" || exit 1
build "dtone-adapter-lib"  || exit 1
build "ml-customer-api"    || exit 1

# ── TIER 5: Services (build only, no publishToMavenLocal) ────────────────────
log ""
log "### TIER 5: Services"
build "ml-auth-service"        false
build "ml-iam-service"         false
build "ml-portal-service"      false
build "ml-payment-service"     false
build "ml-utility-service"     false
build "ml-customer-service"    false
build "ml-product-service"     false
build "ml-fx-service"          false
build "ml-remittance-service"  false
build "ml-batch-service"       false

# ── SUMMARY ───────────────────────────────────────────────────────────────────
log ""
log "========================================"
log "BUILD SUMMARY — $(date '+%Y-%m-%d %H:%M:%S')"
log "========================================"
log "PASSED (${#PASSED[@]}):"
for p in "${PASSED[@]}"; do log "  ✓ $p"; done
log ""
log "FAILED (${#FAILED[@]}):"
if [ ${#FAILED[@]} -eq 0 ]; then
    log "  (none)"
else
    for f in "${FAILED[@]}"; do log "  ✗ $f"; done
fi
log "========================================"
