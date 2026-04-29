# Backend Troubleshoot History

Documented issues, root causes, and fixes encountered during workspace operations.

---

## 2026-04-28

### `git pull` failing on AWS CodeCommit repositories

**Context**: Running `git pull origin develop` across 10 active `com.singtel.ml` repositories hosted on AWS CodeCommit (`git-codecommit.ap-southeast-1.amazonaws.com`).

---

#### Symptoms

```
aws codecommit credential-helper $@ get: aws: command not found
/path/to/vscode/askpass.sh: line 2: mktemp: command not found
Missing or invalid credentials.
Missing pipe
/path/to/vscode/askpass.sh: line 4: cat: command not found
/path/to/vscode/askpass.sh: line 5: rm: command not found
error: unable to read askpass response from '...askpass.sh'
fatal: could not read Username for 'https://git-codecommit.ap-southeast-1.amazonaws.com/...': Device not configured
```

---

#### Root Cause Analysis

Two independent issues compounded each other:

**Issue 1 — AWS credential helper runs without full PATH**

The global `~/.gitconfig` registers the CodeCommit credential helper as:

```ini
[credential "https://git-codecommit.ap-southeast-1.amazonaws.com"]
    helper = !aws codecommit credential-helper $@
    useHttpPath = true
```

The `!` prefix tells git to run it as a shell command. Git spawns a minimal `/bin/sh` subshell for this, which does **not** inherit the user's interactive shell PATH (e.g. `/opt/homebrew/bin`). Since `aws` lives at `/opt/homebrew/bin/aws`, it is not found in that restricted shell.

```
# User's PATH includes:   /opt/homebrew/bin  ← aws is here
# git subshell PATH:      /usr/bin:/bin       ← aws is NOT here
```

**Issue 2 — VSCode `GIT_ASKPASS` intercepts and also fails**

When the credential helper fails, git falls back to the `GIT_ASKPASS` program to prompt for credentials interactively. VSCode sets this environment variable to its own askpass helper script:

```
GIT_ASKPASS=/path/to/vscode/extensions/git/dist/askpass.sh
```

That script internally uses `mktemp`, `cat`, and `rm`. In the restricted Claude Code shell environment these standard utilities are also not on the PATH, so the fallback also fails — resulting in the final `Device not configured` error.

**Combined failure flow:**

```
git pull
  └─ calls credential helper: !aws codecommit credential-helper $@
       └─ FAIL: aws not found in /bin/sh PATH
  └─ falls back to GIT_ASKPASS (VSCode askpass.sh)
       └─ FAIL: mktemp/cat/rm not found in shell PATH
  └─ fatal: Device not configured
```

---

#### Fix

Override both issues inline when invoking git:

1. Unset `GIT_ASKPASS` so VSCode's failing askpass script is never invoked
2. Set `GIT_TERMINAL_PROMPT=0` to prevent git from trying any interactive prompt
3. Override the credential helper with the **full path** to `aws` using git's `-c` flag, so the subshell finds it regardless of PATH

```bash
GIT_ASKPASS="" GIT_TERMINAL_PROMPT=0 \
  /opt/homebrew/bin/git -C "/path/to/repo" \
    -c "credential.https://git-codecommit.ap-southeast-1.amazonaws.com.helper=!/opt/homebrew/bin/aws codecommit credential-helper \$@" \
    pull origin develop
```

Key points:
- `GIT_ASKPASS=""` — disables the VSCode askpass fallback
- `GIT_TERMINAL_PROMPT=0` — disables any interactive terminal prompt fallback
- `-c "credential...helper=!/opt/homebrew/bin/aws ..."` — injects full path to `aws` for this invocation only, without modifying `~/.gitconfig`
- `\$@` — the `$@` must be escaped so the shell passes it literally to git, not expand it immediately

**Note**: The `aws: command not found` warning still appears in output (from the global config helper being attempted first), but git then uses the `-c` override which succeeds. All pulls completed successfully.

---

#### Permanent Fix (optional)

To avoid needing the workaround in future sessions, update `~/.gitconfig` to use the full path permanently:

```bash
/opt/homebrew/bin/git config --global \
  "credential.https://git-codecommit.ap-southeast-1.amazonaws.com.helper" \
  "!/opt/homebrew/bin/aws codecommit credential-helper \$@"
```

This ensures any shell (interactive or restricted) can find `aws` when git calls the credential helper.

---

#### Affected Repositories

All 10 repositories that needed `git pull origin develop`:
`dtone-adapter-lib`, `forter-adapter-lib`, `ml-auth-api`, `ml-payment-api`, `ml-payment-service`, `netsclick-adapter-lib`, `sma-adapter-lib`, `telepin-adapter-lib`, `thunes-adapter-lib`, `tranglo-adapter-lib`

---

## 2026-04-29

### Full build pipeline for all 28 `com.singtel.ml` repositories

**Context**: Building all active repos in dependency order (`build publishToMavenLocal` for libs/APIs, `build` for services) after switching all branches to `develop`.

---

### Issue 1 — `gradlew` CRLF line endings break execution on macOS

#### Symptom

```
env: sh\r: No such file or directory
exit code 127
```

#### Root Cause

All `gradlew` files in the repos have Windows CRLF line endings (`\r\n`). On macOS/Linux, the shebang line `#!/usr/bin/env sh\r` is passed literally including `\r`, so the OS cannot find `sh\r`.

This also recurs after every `git checkout` because the repos have `core.autocrlf` enabled (or no `.gitattributes` forcing LF for `gradlew`).

#### Fix

Strip `\r` from all `gradlew` files before running any build:

```bash
sed -i '' 's/\r//' /path/to/repo/gradlew
```

Apply to all repos at once:

```bash
for p in <all-projects>; do
  sed -i '' 's/\r//' /Users/ThanhNguyen/CurrentWS/$p/gradlew
done
```

**Note**: Must be re-applied after every `git checkout` or `git pull` that touches `gradlew`.

---

### Issue 2 — `tranglo-adapter-lib` fails with "Unable to find a single main class"

#### Symptom

```
> Task :resolveMainClassName FAILED
Unable to find a single main class from the following candidates
[com.singtel.ml.tranglo.adapter.TrangloServiceApplicationV2,
 com.singtel.ml.tranglo.adapter.TrangloServiceApplication]
```

#### Root Cause

The Spring Boot plugin is applied in `tranglo-adapter-lib` (an adapter library, not an application). It found two classes with `main()` and couldn't resolve which one to use for the fat JAR.

#### Fix

Skip `bootJar` and `bootRun` tasks. Adapter libs don't need a fat JAR:

```bash
./gradlew build publishToMavenLocal -x bootJar -x bootRun
```

**Caveat**: `-x bootJar` only works if `bootJar` task exists. Passing it to a project without the Spring Boot plugin causes `Task 'bootJar' not found`. Detect first:

```bash
if ./gradlew tasks --all 2>/dev/null | grep -q "^bootJar "; then
    extra_flags="-x bootJar -x bootRun"
fi
./gradlew build publishToMavenLocal $extra_flags
```

---

### Issue 3 — Services fail `publishToMavenLocal` with "No such file or directory" on jar

#### Symptom

```
Execution failed for task ':generateMetadataFileForMavenPublication'.
> java.io.FileNotFoundException: .../auth-service-2.3.1-SNAPSHOT.jar (No such file or directory)
```

#### Root Cause

When `-x bootJar` is passed to a Spring Boot service, the jar artifact is never created (Spring Boot replaces the regular `jar` task with `bootJar`). The `publishToMavenLocal` task still tries to reference the jar file, which doesn't exist.

#### Fix

Services are standalone applications — nothing depends on them as a Maven artifact. Use `build` only, without `publishToMavenLocal`:

```bash
# Libs and API modules — publish so downstream can resolve them
./gradlew build publishToMavenLocal -x bootJar -x bootRun

# Services — build only (bootJar runs normally)
./gradlew build
```

---

### Issue 4 — `ml-iam-service` fails at configure phase with Gradle cache instrumentation error

#### Symptom

```
A problem occurred configuring root project 'iam-service'.
> java.util.concurrent.ExecutionException: org.gradle.api.GradleException:
  Failed to create Jar file .../spring-core-6.2.11.jar.
Caused by: java.io.IOException: Failed to process the entry
  'META-INF/versions/21/org/springframework/core/task/VirtualThreadDelegate.class'
```

#### Root Cause

`ml-iam-service` used **Gradle 7.6** (`gradle-wrapper.properties`), while Spring Boot 3.x (injected by `PluginMgmt 3.1.0-SNAPSHOT`) pulls in `spring-core-6.2.11`. That JAR is a **multi-release JAR** containing Java 21 bytecode (`VirtualThreadDelegate.class`). Gradle 7.6's `InstrumentingClasspathFileTransformer` cannot process Java 21 class files and fails at the configure phase — before any source is compiled.

This is not fixable by `clean`, cache clearing, or `--no-daemon` because the failure happens during Gradle's own classpath instrumentation, not the project build.

#### Fix

Upgrade `ml-iam-service`'s Gradle wrapper to **8.x** (minimum 8.5, tested on 8.11.1):

```
# gradle/wrapper/gradle-wrapper.properties
distributionUrl=https\://services.gradle.org/distributions/gradle-8.11.1-bin.zip
```

```bash
sed -i '' 's|gradle-7.6-bin.zip|gradle-8.11.1-bin.zip|g' \
  /Users/ThanhNguyen/CurrentWS/ml-iam-service/gradle/wrapper/gradle-wrapper.properties
```

**Constraint**: Any project using `PluginMgmt 3.1.0-SNAPSHOT` or newer (which brings in Spring Boot 3.x → `spring-core 6.2+`) must use **Gradle 8.5+**. Gradle 7.x is incompatible.

---

### Issue 5 — 13 repos using stale `PluginMgmt` versions

#### Symptom

Build succeeds but dependency resolution may pick older transitive versions than intended, causing runtime class-not-found or API mismatch.

#### Root Cause

`develop` branch of `ml-plugin` is **`3.1.0-SNAPSHOT`**, but 13 repos were still referencing older versions (`2.5.x`, `3.0.0-SNAPSHOT`) in their `build.gradle` `buildscript.classpath`.

#### Fix

Update `buildscript.classpath` in `build.gradle` for each outdated repo:

```groovy
// build.gradle — buildscript block
classpath "com.singtel.ml.plugin:PluginMgmt:3.1.0-SNAPSHOT"
```

One-liner to upgrade all at once:

```bash
sed -i '' 's|com.singtel.ml.plugin:PluginMgmt:[0-9.]*-SNAPSHOT|com.singtel.ml.plugin:PluginMgmt:3.1.0-SNAPSHOT|g' \
  /Users/ThanhNguyen/CurrentWS/<project>/build.gradle
```

**Affected repos upgraded on 2026-04-29**:
`telepin-adapter-lib`, `thunes-adapter-lib`, `tranglo-adapter-lib`, `netsclick-adapter-lib`, `forter-adapter-lib`, `sma-adapter-lib`, `dtone-adapter-lib`, `ml-auth-api`, `ml-payment-api`, `ml-portal-api`, `ml-auth-service`, `ml-iam-service`, `ml-payment-service`
