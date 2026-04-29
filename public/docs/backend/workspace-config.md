# Backend Workspace Configuration

Reference for active repositories, branch rules, and tooling setup under `/Users/ThanhNguyen/CurrentWS/`.

---

## Branch Operation Rules

1. Check if `feature/wu_phase3` exists (local or remote)
2. If yes → `git checkout feature/wu_phase3`
3. If no → `git checkout develop && git pull origin develop`
4. If local changes detected before switching → `git stash save "from claude"`

---

## Active Repositories

28 active `com.singtel.ml` projects. Excludes: `tmp/`, deprecated, and non-`com.singtel.ml` projects.

| # | Project | feature/wu_phase3 | Default Action |
|---|---|---|---|
| 1 | `dtone-adapter-lib` | not found | pull `develop` |
| 2 | `forter-adapter-lib` | not found | pull `develop` |
| 3 | `ml-auth-api` | not found | pull `develop` |
| 4 | `ml-auth-service` | exists | checkout `feature/wu_phase3` |
| 5 | `ml-batch-service` | exists | checkout `feature/wu_phase3` |
| 6 | `ml-customer-api` | exists | checkout `feature/wu_phase3` |
| 7 | `ml-customer-service` | exists | checkout `feature/wu_phase3` |
| 8 | `ml-fx-api` | exists | checkout `feature/wu_phase3` |
| 9 | `ml-fx-service` | exists | checkout `feature/wu_phase3` |
| 10 | `ml-hmac-lib` | exists | checkout `feature/wu_phase3` |
| 11 | `ml-iam-service` | exists | checkout `feature/wu_phase3` |
| 12 | `ml-payment-api` | not found | pull `develop` |
| 13 | `ml-payment-service` | not found | pull `develop` |
| 14 | `ml-plugin` | exists | checkout `feature/wu_phase3` |
| 15 | `ml-portal-api` | exists | checkout `feature/wu_phase3` |
| 16 | `ml-portal-service` | exists | checkout `feature/wu_phase3` |
| 17 | `ml-product-api` | exists | checkout `feature/wu_phase3` |
| 18 | `ml-product-service` | exists | checkout `feature/wu_phase3` |
| 19 | `ml-remittance-api` | exists | checkout `feature/wu_phase3` |
| 20 | `ml-remittance-service` | exists | checkout `feature/wu_phase3` |
| 21 | `ml-utility-api` | exists | checkout `feature/wu_phase3` |
| 22 | `ml-utility-service` | exists | checkout `feature/wu_phase3` |
| 23 | `netsclick-adapter-lib` | not found | pull `develop` |
| 24 | `sma-adapter-lib` | not found | pull `develop` |
| 25 | `telepin-adapter-lib` | not found | pull `develop` |
| 26 | `thunes-adapter-lib` | not found | pull `develop` |
| 27 | `tranglo-adapter-lib` | not found | pull `develop` |
| 28 | `wu-adapter-lib` | exists | checkout `feature/wu_phase3` |

---

## Excluded Projects

### Deprecated (always skip)
| Project | Reason |
|---|---|
| `ml-spring-auth-service` | Deprecated |
| `ml-keycloak-service` | Deprecated |
| `ml-registration-service` | Deprecated |
| `ml-registration-service-util` | Deprecated; uses undefined `${mlVersion}` — build fails |
| `ml-registration-api` | Produces deprecated `registration-api` artifact |
| `jumio-adapter-lib` | Deprecated |
| `ml-db-migration` | Deprecated |
| `ml-securedb-migration` | Deprecated |

### Temporary (always skip)
- `tmp/ml-utility-service`
- `tmp/ml-utility-api`

### Non `com.singtel.ml` (out of scope)
- `spring-authorization-server`
- `wiremock/`, `wiremock-jwt-extension`
- `CLC_IAS/`
- `cbpl-fx-ingestion-service`
- `my-api-testing`
- `ml-qa-automation`

---

## Build Constraints

### Plugin Version

| Branch | `PluginMgmt` version | Status |
|---|---|---|
| `develop` | `3.1.0-SNAPSHOT` | **current baseline** |
| `feature/wu_phase3` | `3.2.0-SNAPSHOT` | feature branch only |

- All active repos on `develop` must use `PluginMgmt:3.1.0-SNAPSHOT` in `buildscript.classpath`.
- Check: `grep -r "PluginMgmt" build.gradle`

### Gradle Version

| Condition | Minimum Gradle |
|---|---|
| Any project using `PluginMgmt 3.1.0+` (Spring Boot 3.x / `spring-core 6.2+`) | **8.5** (tested: 8.11.1) |
| Legacy projects (Spring Boot 2.x) | 7.x acceptable |

- Gradle 7.x **cannot** instrument Java 21 multi-release JARs (`VirtualThreadDelegate` in `spring-core 6.2+`). Build fails at configure phase.
- Check: `grep distributionUrl gradle/wrapper/gradle-wrapper.properties`
- Known affected repo upgraded: `ml-iam-service` (7.6 → 8.11.1 on 2026-04-29)

### Build Strategy

| Project type | Gradle command | Notes |
|---|---|---|
| Plugins (`ml-plugin`) | `build publishToMavenLocal` | No Spring Boot plugin |
| Adapter libs | `build publishToMavenLocal -x bootJar -x bootRun` | Skip bootJar only if task exists |
| API modules | `build publishToMavenLocal` | No bootJar task |
| Services | `build` | No `publishToMavenLocal` — nothing consumes services as Maven deps |

Auto-detect whether to skip `bootJar`:
```bash
if ./gradlew tasks --all 2>/dev/null | grep -q "^bootJar "; then
    ./gradlew build publishToMavenLocal -x bootJar -x bootRun
else
    ./gradlew build publishToMavenLocal
fi
```

### `gradlew` CRLF

All `gradlew` files have Windows CRLF endings and must be stripped after every checkout:
```bash
sed -i '' 's/\r//' gradlew
```

See `troubleshoot-history.md` for full details on all issues above.

---

## Build Order

Dependencies must be built and published before their consumers. Full order:

1. `ml-plugin`
2. `ml-hmac-lib`
3. Adapter libs (hmac only): `telepin-adapter-lib`, `wu-adapter-lib`, `tranglo-adapter-lib`, `netsclick-adapter-lib`, `forter-adapter-lib`, `sma-adapter-lib`
4. API modules (hmac only): `ml-auth-api`, `ml-payment-api`, `ml-fx-api`, `ml-product-api`, `ml-utility-api`, `ml-portal-api`
5. Cross-deps: `ml-remittance-api` → `thunes-adapter-lib` → `dtone-adapter-lib` → `ml-customer-api`
6. Services: `ml-auth-service`, `ml-iam-service`, `ml-portal-service`, `ml-payment-service`, `ml-utility-service`, `ml-customer-service`, `ml-product-service`, `ml-fx-service`, `ml-remittance-service`, `ml-batch-service`

Build script: `architecture-practice/tmp/build_all.sh`

---

## Tooling

| Tool | Path |
|---|---|
| `git` | `/opt/homebrew/bin/git` |
| `aws` | `/opt/homebrew/bin/aws` |

### AWS CodeCommit — git pull fix

Git's credential helper subshell does not inherit the user's PATH, causing `aws: command not found`. Use this pattern for all CodeCommit pulls:

```bash
GIT_ASKPASS="" GIT_TERMINAL_PROMPT=0 \
  /opt/homebrew/bin/git -C "/path/to/repo" \
    -c "credential.https://git-codecommit.ap-southeast-1.amazonaws.com.helper=!/opt/homebrew/bin/aws codecommit credential-helper \$@" \
    pull origin <branch>
```

See `troubleshoot-history.md` for full diagnosis.
