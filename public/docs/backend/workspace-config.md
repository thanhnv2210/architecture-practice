# Backend Workspace Configuration

Reference for active repositories, branch rules, and tooling setup under `/Users/ThanhNguyen/CurrentWS/`.

---

## Branch Operation Rules

1. Check if `feature/wu_phase3` exists (local or remote)
2. If yes → `git checkout feature/wu_phase3` and pull
3. If no → `git checkout develop && git pull origin develop`
4. If local changes detected before switching → `git stash save "from claude"`

> **Current active context (2026-04-29)**: 18 repos on `feature/wu_phase3`, 10 repos on `develop` (no feature branch exists for those).
> After switching to feature branch, re-apply CRLF fix: `sed -i '' 's/\r//' gradlew`

---

## Active Repositories

28 active `com.singtel.ml` projects. Excludes: `tmp/`, deprecated, and non-`com.singtel.ml` projects.

Last updated: 2026-04-29

| # | Project | Active Branch | PluginMgmt | feature/wu_phase3 | Note |
|---|---|---|---|---|---|
| 1 | `ml-plugin` | `feature/wu_phase3` | N/A (is the plugin) | exists | |
| 2 | `ml-hmac-lib` | `feature/wu_phase3` | `3.2.0-SNAPSHOT` | exists | |
| 3 | `telepin-adapter-lib` | `develop` | `3.1.0-SNAPSHOT` | not found | No feature branch |
| 4 | `wu-adapter-lib` | `feature/wu_phase3` | `3.1.0-SNAPSHOT` | exists | ⚠️ Feature branch not upgraded to 3.2.0 |
| 5 | `tranglo-adapter-lib` | `develop` | `3.1.0-SNAPSHOT` | not found | No feature branch |
| 6 | `netsclick-adapter-lib` | `develop` | `3.1.0-SNAPSHOT` | not found | No feature branch |
| 7 | `forter-adapter-lib` | `develop` | `3.1.0-SNAPSHOT` | not found | No feature branch |
| 8 | `sma-adapter-lib` | `develop` | `3.1.0-SNAPSHOT` | not found | No feature branch |
| 9 | `ml-auth-api` | `develop` | `3.2.0-SNAPSHOT` | not found | ⚠️ Manually upgraded to 3.2.0 to publish `auth-api:3.2.0-SNAPSHOT` for feature branch services |
| 10 | `ml-payment-api` | `develop` | `3.1.0-SNAPSHOT` | not found | No feature branch |
| 11 | `ml-fx-api` | `feature/wu_phase3` | `3.2.0-SNAPSHOT` | exists | |
| 12 | `ml-product-api` | `feature/wu_phase3` | `3.2.0-SNAPSHOT` | exists | |
| 13 | `ml-utility-api` | `feature/wu_phase3` | `3.2.0-SNAPSHOT` | exists | |
| 14 | `ml-portal-api` | `feature/wu_phase3` | `3.2.0-SNAPSHOT` | exists | |
| 15 | `ml-remittance-api` | `develop` | `3.1.0-SNAPSHOT` | not found | No feature branch |
| 16 | `thunes-adapter-lib` | `develop` | `3.1.0-SNAPSHOT` | not found | No feature branch |
| 17 | `dtone-adapter-lib` | `develop` | `3.1.0-SNAPSHOT` | not found | No feature branch |
| 18 | `ml-customer-api` | `feature/wu_phase3` | `3.2.0-SNAPSHOT` | exists | |
| 19 | `ml-auth-service` | `feature/wu_phase3` | `3.2.0-SNAPSHOT` | exists | |
| 20 | `ml-iam-service` | `feature/wu_phase3` | `3.2.0-SNAPSHOT` | exists | Gradle wrapper upgraded to 8.11.1 (was 7.6) |
| 21 | `ml-portal-service` | `feature/wu_phase3` | `3.2.0-SNAPSHOT` | exists | |
| 22 | `ml-payment-service` | `develop` | `3.1.0-SNAPSHOT` | not found | No feature branch |
| 23 | `ml-utility-service` | `feature/wu_phase3` | `3.2.0-SNAPSHOT` | exists | |
| 24 | `ml-customer-service` | `feature/wu_phase3` | `3.2.0-SNAPSHOT` | exists | |
| 25 | `ml-product-service` | `feature/wu_phase3` | `3.2.0-SNAPSHOT` | exists | |
| 26 | `ml-fx-service` | `feature/wu_phase3` | `3.2.0-SNAPSHOT` | exists | ⚠️ Has uncommitted local changes — could not pull |
| 27 | `ml-remittance-service` | `feature/wu_phase3` | `3.2.0-SNAPSHOT` | exists | |
| 28 | `ml-batch-service` | `feature/wu_phase3` | `3.2.0-SNAPSHOT` | exists | |

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

## Isolating the Build Environment (Disabling S3 Maven Repository)

The S3 repository `s3://ml-maven-repository/maven` is declared directly in each project's `build.gradle` (buildscript, dependency resolution, and publishing blocks). To disable it without any code change, use a Gradle init script.

### How to disable

Create the file `~/.gradle/init.d/disable-s3-repo.gradle`:

```groovy
allprojects {
    buildscript {
        repositories {
            all { repo ->
                if (repo instanceof MavenArtifactRepository && repo.url.toString().startsWith("s3://")) {
                    remove(repo)
                    logger.lifecycle("[init] Disabled S3 buildscript repo: ${repo.url}")
                }
            }
        }
    }
    repositories {
        all { repo ->
            if (repo instanceof MavenArtifactRepository && repo.url.toString().startsWith("s3://")) {
                remove(repo)
                logger.lifecycle("[init] Disabled S3 dependency repo: ${repo.url}")
            }
        }
    }
    plugins.withId("maven-publish") {
        publishing {
            repositories {
                all { repo ->
                    if (repo instanceof MavenArtifactRepository && repo.url.toString().startsWith("s3://")) {
                        remove(repo)
                        logger.lifecycle("[init] Disabled S3 publish repo: ${repo.url}")
                    }
                }
            }
        }
    }
}
```

Gradle automatically loads every `*.gradle` file in `~/.gradle/init.d/` before any project build. The `all { repo -> }` handler fires for each repository as it is registered and removes it if it is an S3 URL — covering all three declaration sites per project.

### Toggle

```bash
# Block S3 (file exists)
ls ~/.gradle/init.d/disable-s3-repo.gradle

# Re-enable S3 (delete the file)
rm ~/.gradle/init.d/disable-s3-repo.gradle
```

No git commits or project file changes required.

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
