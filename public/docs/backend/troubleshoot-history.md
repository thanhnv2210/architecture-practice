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
