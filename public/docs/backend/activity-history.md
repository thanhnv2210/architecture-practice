# Backend Activity History

Chronological log of actions performed on the backend workspace (`/Users/ThanhNguyen/CurrentWS/`).

---

## 2026-04-28

### Dependency Analysis Document Created
- Scanned all `build.gradle` files under `/CurrentWS/`
- Extracted all `com.singtel.ml` artifact dependencies
- Resolved version values from `ml-plugin/src/main/groovy/com/singtel/ml/plugin/PluginMgmt.groovy` (v3.2.0-SNAPSHOT)
- Created `public/docs/backend/dependency-analysis.md` with:
  - Canonical artifact version table (22 artifacts)
  - Adapter library dependency map
  - API module dependency map
  - Per-service transitive dependency map (14 services)
  - 6 identified transitive conflicts and risks
  - Recommendations

---

### Deprecated Components Marked

The following components were marked as deprecated in `dependency-analysis.md`:

| Component | Type | Reason |
|---|---|---|
| `ml-spring-auth-service` | Service | Deprecated by team |
| `ml-keycloak-service` | Service | Deprecated by team |
| `ml-registration-service` | Service | Deprecated by team |
| `ml-registration-service-util` | Service | Deprecated by team; uses undefined `${mlVersion}` variable — build would fail |
| `registration-api` | API module | Deprecated by team |
| `jumio-adapter-lib` | Adapter lib | Deprecated by team |
| `ml-db-migration` | Migration | Deprecated by team |
| `ml-registration-api` | API project | Produces deprecated `registration-api` artifact |
| `ml-securedb-migration` | Migration | Deprecated by team |

All deprecated components moved to Section 9 of the dependency analysis document.

---

### Branch Operations — `feature/wu_phase3` / `develop`

Executed across **28 active `com.singtel.ml` projects** (excluded: `tmp/`, deprecated projects).

**Rule applied:**
- If `feature/wu_phase3` exists (local or remote) → checkout `feature/wu_phase3`
- Otherwise → checkout + pull `develop`
- If local uncommitted changes detected → `git stash save "from claude"` before switching

#### Stashed (local changes saved as "from claude")

| Project | Was On | Stash Saved |
|---|---|---|
| `ml-batch-service` | `feature/wu_phase3` | yes |
| `ml-fx-api` | `develop` | yes |
| `ml-iam-service` | `develop` | yes |
| `ml-portal-api` | `develop` | yes |
| `ml-product-service` | `feature/DASHREMIT-868` | yes |
| `ml-remittance-service` | `release/3.1.0` | yes |
| `ml-utility-api` | `develop` | yes |
| `wu-adapter-lib` | `feature/DASHREMIT-881` | yes |
| `tranglo-adapter-lib` | `develop` | yes |

To recover stashed changes: `git stash pop` or `git stash list` in each repo.

#### Checked out `feature/wu_phase3`

| Project | Previous Branch | Notes |
|---|---|---|
| `ml-batch-service` | `feature/wu_phase3` | already on branch |
| `ml-hmac-lib` | `feature/wu_phase3` | already on branch |
| `ml-plugin` | `feature/wu_phase3` | already on branch |
| `ml-auth-service` | `develop` | new local tracking branch |
| `ml-customer-api` | `develop` | new local tracking branch |
| `ml-customer-service` | `develop` | new local tracking branch |
| `ml-fx-api` | `develop` | new local tracking branch |
| `ml-fx-service` | `feature/DASHREMIT-882` | new local tracking branch |
| `ml-iam-service` | `develop` | new local tracking branch |
| `ml-portal-api` | `develop` | new local tracking branch |
| `ml-portal-service` | `develop` | new local tracking branch |
| `ml-product-api` | `develop` | new local tracking branch |
| `ml-product-service` | `feature/DASHREMIT-868` | new local tracking branch |
| `ml-remittance-api` | `develop` | ⚠️ behind origin by 4 commits — run `git pull` |
| `ml-remittance-service` | `release/3.1.0` | ⚠️ behind origin by 7 commits — run `git pull` |
| `ml-utility-api` | `develop` | new local tracking branch |
| `ml-utility-service` | `develop` | new local tracking branch |
| `wu-adapter-lib` | `feature/DASHREMIT-881` | up to date with origin |

#### Pulled `develop`

| Project | Previous Branch | Pull Result |
|---|---|---|
| `dtone-adapter-lib` | `feature/DASHREMIT-3021` | fast-forward (build.gradle updated) |
| `forter-adapter-lib` | `feature/DASHREMIT-3021` | fast-forward (build.gradle updated) |
| `ml-auth-api` | `feature/DASHREMIT-3021` | fast-forward (build.gradle updated) |
| `ml-payment-api` | `release/2.4.1` | fast-forward (build.gradle updated) |
| `ml-payment-service` | `develop` | already up to date |
| `netsclick-adapter-lib` | `feature/DASHREMIT-3021` | fast-forward (build.gradle updated) |
| `sma-adapter-lib` | `feature/DASHREMIT-3021` | fast-forward (build.gradle updated) |
| `telepin-adapter-lib` | `develop` | already up to date |
| `thunes-adapter-lib` | `develop` | already up to date |
| `tranglo-adapter-lib` | `develop` | already up to date |

#### Pull Troubleshooting Note
First two attempts failed because:
1. Git credential helper (`!aws codecommit credential-helper $@`) uses `aws` without a full path — git's subshell does not inherit the user's PATH.
2. VSCode's `GIT_ASKPASS` helper was intercepting auth but also failed due to missing `mktemp`/`cat`/`rm` in the restricted shell.

**Fix applied**: unset `GIT_ASKPASS`, set `GIT_TERMINAL_PROMPT=0`, and override the credential helper with the full binary path (`/opt/homebrew/bin/aws`) via `-c` flag on the git command. All pulls succeeded on the third attempt.

#### Outstanding Actions Required

| Project | Action Needed |
|---|---|
| `ml-remittance-api` | `git pull` on `feature/wu_phase3` (4 commits behind) |
| `ml-remittance-service` | `git pull` on `feature/wu_phase3` (7 commits behind) |
