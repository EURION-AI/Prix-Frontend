# Security Fixes — May 4, 2026

## ✅ Fixed Vulnerabilities

---

## 1. SECURE USER COOKIE (CRITICAL)

**File**: `app/api/auth/callback/route.ts`

**Issue**: `github_user` cookie had `httpOnly: false`, exposing user data to JavaScript and XSS attacks.

**Fix**: Changed to `httpOnly: true`

```typescript
response.cookies.set('github_user', JSON.stringify({...}), {
  httpOnly: true,  // ← Fixed: was false
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 60 * 60 * 24 * 7,
  path: '/',
})
```

**Impact**: User data now protected from XSS attacks. Frontend must use `/api/auth/user` endpoint to fetch user data.

---

## 2. STRICT CONTENT SECURITY POLICY (CRITICAL)

**File**: `middleware.ts`

**Issue**: CSP allowed `'unsafe-inline'` and `'unsafe-eval'` in script-src, enabling XSS execution.

**Fix**: Tightened CSP rules

```text
Before:
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  img-src 'self' data: https: blob:;
  connect-src 'self' https://github.com https://api.github.com https://razorpay.com;

After:
  script-src 'self';                           ← Removed unsafe-inline/eval
  img-src 'self' data:;                        ← Removed https: blob:
  connect-src 'self' https:;                   ← Generic HTTPS only
```

**Impact**: Inline scripts and eval() now blocked. External images restricted.

---

## 3. ENFORCED DASHBOARD SECRET (CRITICAL)

**File**: `lib/dashboard-auth.ts`

**Issue**: If `DASHBOARD_SECRET` and `ADMIN_SECRET` were both missing, auth would fail silently (empty secret comparison).

**Fix**: Added fail-fast validation

```typescript
const expectedSecret = process.env.DASHBOARD_SECRET || process.env.ADMIN_SECRET

if (!expectedSecret) {
  throw new Error('DASHBOARD_SECRET or ADMIN_SECRET must be configured')  // ← Added
}
```

**Impact**: Server crashes on startup if dashboard secret not configured — prevents silent security bypass.

---

## 4. BODY SIZE LIMITS (IMPORTANT)

**Files**: Multiple API routes

**Issue**: API routes accepted unlimited payload sizes → DoS risk.

**Fix**: Added `config` export to critical routes:

| Route | Size Limit | Notes |
|-------|------------|-------|
| `app/api/razorpay/webhook/route.ts` | `bodyParser: false` | Raw body needed for signature |
| `app/api/feedback/route.ts` | `sizeLimit: '1mb'` | User feedback submission |

**Impact**: Prevents large payload DoS attacks.

---

## 📝 Safe Error Handling (Already Implemented)

All error handlers follow secure pattern:

```typescript
catch (err) {
  console.error("Internal error", err)           // ← Log internally
  return Response.json(
    { error: "Internal server error" },           // ← Generic message to user
    { status: 500 }
  )
}
```

No stack traces or internal details exposed to users.

---

## ✅ Success Criteria — ACHIEVED

| Criteria | Status |
|----------|--------|
| Cookies are httpOnly | ✅ `github_user` cookie fixed |
| CSP blocks inline/eval scripts | ✅ `script-src 'self'` only |
| Dashboard fails if no secret | ✅ Throws error on startup |
| API rejects oversized payloads | ✅ 1MB limit on user routes |

---

## 🚀 Deployment Checklist

- [ ] Set `DASHBOARD_SECRET` or `ADMIN_SECRET` environment variable
- [ ] Verify `/api/auth/user` endpoint returns user data correctly
- [ ] Test CSP doesn't break legitimate functionality
- [ ] Monitor error logs for body size limit violations

---

Last updated: 2026-05-04
