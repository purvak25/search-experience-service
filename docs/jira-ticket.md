# SEARCH-5124

## Summary

New search experience unintentionally enabled for all users during staged rollout deployment.

---

## Severity

P1 - Critical

---

## Symptoms

- Massive spike in search API failures
- Increased search latency across all regions
- Elevated backend timeout errors
- Customer complaints regarding broken search experience
- New search traffic increased from expected 5% to 100%

---

## Detection

CloudWatch alarms triggered for:
- search error rate spike
- elevated API latency
- increased backend timeout failures

Customer support and product teams also reported widespread search instability shortly after deployment.

---

## Root Cause

Feature flag condition was accidentally inverted during rollout implementation.

Broken logic:

```javascript
if (!featureFlagEnabled) {
   enableNewSearch();
}
```

The new search experience was enabled for all users instead of the intended pilot rollout group.

---

## Resolution

- Corrected feature flag condition
- Rolled back full traffic exposure
- Added rollout percentage validation
- Added feature exposure monitoring

---

## Status

Resolved
