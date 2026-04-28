# com.singtel.ml Dependency Analysis

> Source: scanned from `/Users/ThanhNguyen/CurrentWS/` — all `build.gradle` files
> Version values resolved from `ml-plugin/src/main/groovy/com/singtel/ml/plugin/PluginMgmt.groovy` (v3.2.0-SNAPSHOT)

---

## 1. Canonical Artifact Versions (PluginMgmt 3.2.0-SNAPSHOT)

| Variable | Artifact (artifactId) | Resolved Version |
|---|---|---|
| `mlHmacLibVersion` | `ml-hmac-lib` | `3.2.0-SNAPSHOT` |
| `mlTelepinLibVersion` | `ml-telepin-adapter-lib` | `2.5.6-SNAPSHOT` |
| `mlThunesLibVersion` | `ml-thunes-adapter-lib` | `2.3.7-SNAPSHOT` |
| `mlWULibVersion` | `ml-wu-adapter-lib` | `3.1.0-SNAPSHOT` |
| `mTrangloLibVersion` | `ml-tranglo-adapter-lib` | `1.0.3-SNAPSHOT` |
| `mlDTOneLibVersion` | `ml-dtone-adapter-lib` | `1.1.0-SNAPSHOT` |
| `mlNetsclickLibVersion` | `ml-netsclick-adapter-lib` | `1.0.0-SNAPSHOT` |
| `mlForterLibVersion` | `ml-forter-adapter-lib` | `1.0.3-SNAPSHOT` |
| `mlSmaLibVersion` | `sma-adapter-lib` | `1.2.0-SNAPSHOT` |
| `mJumioLibVersion` | `ml-jumio-adapter-lib` | `1.0.0-SNAPSHOT` |
| `mlAuthServiceVersion` | `auth-api` | `3.2.0-SNAPSHOT` |
| `mlCustomerServiceVersion` | `customer-api` | `3.2.0-SNAPSHOT` |
| `mlPaymentServiceVersion` | `payment-api` | `1.2.0-SNAPSHOT` |
| `mlRemittanceServiceVersion` | `remittance-api` | `3.2.0-SNAPSHOT` |
| `mlFxServiceVersion` | `ml-fx-api` | `3.2.0-SNAPSHOT` |
| `mlProductServiceVersion` | `ml-product-api` | `3.2.0-SNAPSHOT` |
| `mlUtilityServiceVersion` | `ml-utility-api` | `3.2.0-SNAPSHOT` |
| `mlPortalServiceVersion` | `portal-api` | `3.2.0-SNAPSHOT` |
| `mlIamServiceVersion` | `ml-iam-service` | `3.2.0-SNAPSHOT` |
| `mlBatchServiceVersion` | `ml-batch-service` (batch-service) | `3.2.0-SNAPSHOT` |
| `mlKeycloakLibVersion` | `ml-keycloak-telepin-provider-library` | `1.0.3-SNAPSHOT` |

---

## 2. Adapter Library Dependencies

Adapter libs are shared building blocks. Each has its own direct `com.singtel.ml` dependencies.

| Adapter Library | Direct com.singtel.ml Dependencies |
|---|---|
| `ml-hmac-lib` | _(none)_ |
| `ml-telepin-adapter-lib` | `ml-hmac-lib` |
| `ml-thunes-adapter-lib` | `ml-hmac-lib`, `remittance-api` |
| `ml-wu-adapter-lib` | `ml-hmac-lib` |
| `ml-tranglo-adapter-lib` | `ml-hmac-lib` |
| `ml-dtone-adapter-lib` | `ml-hmac-lib`, `payment-api` |
| `ml-netsclick-adapter-lib` | `ml-hmac-lib` |
| `ml-forter-adapter-lib` | `ml-hmac-lib` |
| `sma-adapter-lib` | `ml-hmac-lib` |
| `ml-jumio-adapter-lib` | `ml-hmac-lib` |

---

## 3. API Module Dependencies

API modules (consumed as contracts by services).

| API Module | Direct com.singtel.ml Dependencies |
|---|---|
| `auth-api` | `ml-hmac-lib` |
| `customer-api` | `ml-telepin-adapter-lib`, `ml-thunes-adapter-lib`, `ml-hmac-lib` |
| `payment-api` | `ml-hmac-lib` |
| `remittance-api` | `ml-telepin-adapter-lib`, `ml-hmac-lib` |
| `ml-fx-api` | `ml-hmac-lib` |
| `ml-product-api` | `ml-hmac-lib` |
| `ml-utility-api` | `ml-hmac-lib` |
| `portal-api` | `ml-hmac-lib` |

---

## 4. Service Dependency Map

### ml-auth-service
- **PluginMgmt**: `2.5.2-SNAPSHOT` ⚠️
- **Direct**: `auth-api`, `ml-telepin-adapter-lib`, `ml-hmac-lib`
- **Transitive**: `ml-hmac-lib` (via auth-api, telepin)

### ml-iam-service
- **PluginMgmt**: `2.5.2-SNAPSHOT` ⚠️
- **Direct**: `ml-hmac-lib`, `ml-telepin-adapter-lib`
- **Transitive**: `ml-hmac-lib` (via telepin)

### ml-customer-service
- **PluginMgmt**: `3.1.0-SNAPSHOT`
- **Direct**: `customer-api`, `ml-telepin-adapter-lib`, `ml-hmac-lib`, `ml-utility-api`, `sma-adapter-lib`, `ml-thunes-adapter-lib`, `ml-product-api`
- **Transitive**:
  - `customer-api` → `ml-telepin-adapter-lib`, `ml-thunes-adapter-lib`, `ml-hmac-lib`
  - `ml-thunes-adapter-lib` → `remittance-api`, `ml-hmac-lib`
  - `ml-telepin-adapter-lib`, `ml-utility-api`, `sma-adapter-lib`, `ml-product-api` → `ml-hmac-lib`

### ml-payment-service
- **PluginMgmt**: `2.5.2-SNAPSHOT` ⚠️
- **Direct**: `payment-api`, `ml-telepin-adapter-lib`, `ml-hmac-lib`, `ml-dtone-adapter-lib`, `ml-netsclick-adapter-lib`, `remittance-api`
- **Transitive**:
  - `ml-dtone-adapter-lib` → `payment-api` (duplicate, same version), `ml-hmac-lib`
  - `ml-telepin-adapter-lib`, `ml-netsclick-adapter-lib`, `remittance-api` → `ml-hmac-lib`
  - `remittance-api` → `ml-telepin-adapter-lib` (duplicate direct dep)

### ml-utility-service
- **PluginMgmt**: `3.1.0-SNAPSHOT`
- **Direct**: `ml-telepin-adapter-lib`, `ml-thunes-adapter-lib`, `ml-hmac-lib`, `ml-utility-api`, `ml-tranglo-adapter-lib`, `ml-wu-adapter-lib`
- **Transitive**:
  - `ml-thunes-adapter-lib` → `remittance-api`, `ml-hmac-lib`
  - all adapters → `ml-hmac-lib`

### ml-product-service
- **PluginMgmt**: `3.1.0-SNAPSHOT`
- **Direct**: `ml-product-api`, `ml-hmac-lib`, `ml-utility-api`, `ml-telepin-adapter-lib`, `ml-dtone-adapter-lib`, `customer-api`, `ml-tranglo-adapter-lib`
- **Transitive**:
  - `customer-api` → `ml-telepin-adapter-lib` (duplicate), `ml-thunes-adapter-lib`, `ml-hmac-lib`
  - `ml-thunes-adapter-lib` → `remittance-api`, `ml-hmac-lib`
  - `ml-dtone-adapter-lib` → `payment-api`, `ml-hmac-lib`
  - all others → `ml-hmac-lib`

### ml-fx-service
- **PluginMgmt**: `3.1.0-SNAPSHOT`
- **Direct**: `ml-fx-api`, `customer-api`, `ml-product-api`, `ml-utility-api`, `ml-thunes-adapter-lib`, `ml-telepin-adapter-lib`, `ml-hmac-lib`, `ml-wu-adapter-lib`, `ml-tranglo-adapter-lib`
- **Transitive**:
  - `customer-api` → `ml-telepin-adapter-lib` (duplicate), `ml-thunes-adapter-lib` (duplicate), `ml-hmac-lib`
  - `ml-thunes-adapter-lib` → `remittance-api`, `ml-hmac-lib`
  - all others → `ml-hmac-lib`

### ml-remittance-service
- **PluginMgmt**: `3.1.0` (release)
- **Direct**: `remittance-api`, `customer-api`, `ml-fx-api`, `payment-api`, `portal-api`, `ml-hmac-lib`, `ml-utility-api`, `ml-product-api`, `ml-wu-adapter-lib`, `ml-tranglo-adapter-lib`, `ml-thunes-adapter-lib`, `ml-telepin-adapter-lib`, `ml-forter-adapter-lib`
- **Transitive**:
  - `remittance-api` → `ml-telepin-adapter-lib` (duplicate), `ml-hmac-lib`
  - `customer-api` → `ml-telepin-adapter-lib` (duplicate), `ml-thunes-adapter-lib` (duplicate), `ml-hmac-lib`
  - `ml-thunes-adapter-lib` → `remittance-api` (duplicate direct dep)
  - all adapters, API modules → `ml-hmac-lib`

### ml-portal-service
- **PluginMgmt**: `3.1.0-SNAPSHOT`
- **Direct**: `portal-api`, `ml-hmac-lib`
- **Transitive**: `ml-hmac-lib` (via portal-api)

### ml-batch-service
- **PluginMgmt**: `3.2.0-SNAPSHOT` (latest)
- **Direct**: `ml-utility-api`, `remittance-api`, `payment-api`, `ml-product-api`, `ml-hmac-lib`, `ml-fx-api`
- **Transitive**:
  - `remittance-api` → `ml-telepin-adapter-lib`, `ml-hmac-lib`
  - all API modules → `ml-hmac-lib`

---

## 5. Transitive Dependency Conflicts & Risks

### CONFLICT-1: `ml-thunes-adapter-lib` pulls `remittance-api` transitively

`ml-thunes-adapter-lib` (v2.3.7-SNAPSHOT, built with PluginMgmt 2.5.6-SNAPSHOT) has a compile-time dependency on `remittance-api`. The version of `remittance-api` baked into that lib was resolved from PluginMgmt 2.5.6-SNAPSHOT, which likely injected an older `mlRemittanceServiceVersion` than `3.2.0-SNAPSHOT`.

**Affected services**: `ml-customer-service`, `ml-fx-service`, `ml-utility-service`, `ml-product-service`, `ml-remittance-service`

**Risk**: Gradle dependency resolution will pick the *higher* version (default strategy), but API surface differences between the transitively pulled `remittance-api` and the directly declared one may cause class-not-found issues at runtime.

---

### CONFLICT-2: `ml-dtone-adapter-lib` pulls `payment-api` transitively

`ml-dtone-adapter-lib` (v1.1.0-SNAPSHOT, PluginMgmt 2.5.1-SNAPSHOT) bundles a dependency on `payment-api`. If the `mlPaymentServiceVersion` injected by PluginMgmt 2.5.1-SNAPSHOT differs from `1.2.0-SNAPSHOT`, the `payment-api` class contracts may mismatch.

**Affected services**: `ml-payment-service`, `ml-product-service`

---

### CONFLICT-3: `customer-api` pulls adapter libs transitively

`customer-api` (v3.2.0-SNAPSHOT) depends on both `ml-telepin-adapter-lib` and `ml-thunes-adapter-lib`. Services that also declare these adapters directly will get two resolution paths. If the service's PluginMgmt version injects a different `mlTelepinLibVersion` than what `customer-api` was compiled against, mismatched transitive resolution occurs.

**Affected services**: `ml-customer-service`, `ml-fx-service`, `ml-remittance-service`, `ml-product-service`

---

### CONFLICT-4: `remittance-api` pulls `ml-telepin-adapter-lib` transitively

`remittance-api` depends on `ml-telepin-adapter-lib`. Services that directly declare `ml-telepin-adapter-lib` AND consume `remittance-api` have a duplicate resolution path. Combined with Conflict-1, `ml-remittance-service` and `ml-payment-service` face a three-way pull on `ml-telepin-adapter-lib`.

**Affected services**: `ml-remittance-service`, `ml-payment-service`, `ml-batch-service`

---

### CONFLICT-5: PluginMgmt version skew across active projects

Different projects build with significantly different PluginMgmt versions, which means each project resolves `ml-*` library versions from different sets of injected properties. Projects sharing a runtime classpath (if composed) may have incompatible assumptions.

| PluginMgmt Version | Projects |
|---|---|
| `3.2.0-SNAPSHOT` (latest) | `ml-hmac-lib`, `ml-batch-service` |
| `3.1.0-SNAPSHOT` / `3.1.0` | `ml-remittance-service`, `ml-fx-service`, `ml-customer-service`, `ml-utility-service`, `ml-product-service`, `ml-portal-service`, `ml-utility-api`, `ml-product-api`, `ml-fx-api`, `ml-customer-api`, `ml-remittance-api`, `wu-adapter-lib` |
| `3.0.0` / `3.0.0-SNAPSHOT` | `ml-payment-api`, `ml-portal-api` |
| `2.5.x-SNAPSHOT` | `ml-payment-service`, `ml-auth-service`, `ml-iam-service`, `telepin-adapter-lib`, `thunes-adapter-lib`, `tranglo-adapter-lib`, `netsclick-adapter-lib`, `sma-adapter-lib`, `dtone-adapter-lib`, `forter-adapter-lib` |
| `2.3.x-SNAPSHOT` | `ml-registration-api`, `jumio-adapter-lib` |

**Key concern**: Adapter libraries built with PluginMgmt `2.5.x` embed version assumptions that are up to 2 major versions behind the current plugin. Any API module they transitively depend on was resolved at those older versions.

---

## 6. Dependency Graph Summary

```
ml-hmac-lib (root, no com.singtel.ml deps)
  ^-- ml-telepin-adapter-lib
        ^-- remittance-api
        ^-- customer-api
        ^-- auth-api
        ^-- [all adapter libs]
        ^-- [all API modules]
        ^-- [all services]

remittance-api
  ^-- ml-thunes-adapter-lib  [CONFLICT-1: version skew risk]
  ^-- ml-remittance-service (direct)
  ^-- ml-payment-service (direct)
  ^-- ml-batch-service (direct)

payment-api
  ^-- ml-dtone-adapter-lib  [CONFLICT-2: version skew risk]
  ^-- ml-payment-service (direct)
  ^-- ml-product-service (via dtone, transitive)

customer-api
  -> ml-telepin-adapter-lib  [CONFLICT-3: duplicate resolution]
  -> ml-thunes-adapter-lib   [CONFLICT-3: duplicate resolution]
  ^-- ml-customer-service (direct)
  ^-- ml-fx-service (direct)
  ^-- ml-remittance-service (direct)
  ^-- ml-product-service (direct)
```

---

## 7. Recommendations

| # | Issue | Recommendation |
|---|---|---|
| 1 | Adapter libs (2.5.x plugin) embed stale API module versions | Upgrade all adapter libs to use PluginMgmt 3.2.0-SNAPSHOT and republish |
| 2 | `ml-thunes-adapter-lib` → `remittance-api` transitive dep | Consider removing `remittance-api` from `ml-thunes-adapter-lib` and letting consumers declare it directly (`compileOnly` or move to `api` scope if using a multi-module project) |
| 3 | `ml-dtone-adapter-lib` → `payment-api` transitive dep | Same as above — remove transitive `payment-api` from dtone lib |
| 4 | `customer-api` carrying adapter lib deps | API modules should be thin contracts. Remove `ml-telepin-adapter-lib` and `ml-thunes-adapter-lib` from `customer-api` dependencies |
| 5 | Plugin version skew | Align all active projects to PluginMgmt `3.2.0-SNAPSHOT` as a baseline to ensure consistent version injection |

---

## 8. Deprecated Components

The following components are deprecated and should not be used in new development or new service dependencies.

---

### ~~registration-api~~
- **Variable**: `mlRegistrationServiceVersion`
- **Last known version**: `2.2.2-SNAPSHOT`
- **Direct com.singtel.ml Dependencies**: _(none)_
- **Known consumers**: `ml-registration-service` _(deprecated)_, `ml-registration-service-util` _(deprecated)_

---

### ~~ml-spring-auth-service~~
- **PluginMgmt**: `1.0.3-SNAPSHOT`
- **Direct**: `ml-hmac-lib`

---

### ~~ml-keycloak-service~~
- **PluginMgmt**: `1.0.2-SNAPSHOT`
- **Direct**: `ml-keycloak-telepin-provider-library` (via `localDeps`)

---

### ~~ml-registration-service~~
- **PluginMgmt**: `2.3.6-SNAPSHOT`
- **Direct**: `registration-api`, `ml-telepin-adapter-lib`, `sma-adapter-lib`, `ml-hmac-lib`, `ml-jumio-adapter-lib`
- **Transitive**: `ml-hmac-lib` (via all adapters)

---

### ~~ml-registration-service-util~~
- **PluginMgmt**: `1.0.1`
- **Direct**: `registration-api:${mlVersion}`, `ml-telepin-adapter-lib:${mlVersion}`, `ml-hmac-lib:${mlVersion}`
- **Note**: Uses `${mlVersion}` — not injected by any PluginMgmt version. **Build will FAIL** unless passed as a `-P` flag or set in a local `gradle.properties`.
