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
