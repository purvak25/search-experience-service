# Incident Timeline: SEARCH-5124

**Incident ID:** SEARCH-5124  
**Date:** 2024-07-11  
**Duration:** 42 minutes  
**Severity:** P1 - Critical  

---

# Timeline (UTC)

### 09:50 - Deployment Completed

Commit `d91ac42` ("Roll out new search experience to pilot users") deployed to production through CI/CD pipeline.

No rollout exposure validation existed for feature flag behavior.

---

### 10:04 - Detection

CloudWatch alarms triggered:
- elevated search API failures
- increased backend latency
- search timeout spikes

Customer complaints also began increasing shortly after deployment.

---

### 10:08 - Initial Investigation

On-call engineer observed:
- elevated search failure rates
- increased API timeout errors
- abnormal traffic routed to new search backend

Feature exposure metrics showed unexpected rollout behavior.

---

### 10:11 - Escalation

Incident declared in `#incidents-search-platform`

Backend, Platform, and SRE teams joined investigation bridge.

---

### 10:13 - Root Cause Suspected

Engineering identified possible feature flag logic issue in search request routing.

Observed rollout metrics:

```text
Expected new search exposure: 5%
Actual new search exposure: 100%
```

---

### 10:17 - Root Cause Confirmed

Feature flag condition discovered to be inverted in `src/search_handler.js`

Broken logic:

```javascript
if (!featureFlagEnabled) {
   enableNewSearch();
}
```

The unfinished search experience was enabled for all users instead of the intended rollout group.

This caused:
- elevated search failures
- backend timeout spikes
- degraded customer experience
- increased API latency

---

### 10:24 - Rollback Initiated

Traffic gradually shifted back to stable search infrastructure.

Feature exposure reduced from 100% to expected rollout percentage.

---

### 10:28 - Hotfix Preparation

Branch `hotfix/fix-search-rollout-condition` created.

Fixes added:
- corrected feature flag logic
- rollout percentage validation
- feature exposure monitoring

---

### 10:34 - Hotfix Validation

Code review completed.

Additional rollout safeguards added for future deployments.

---

### 10:36 - Hotfix Deployed

Production deployment completed successfully.

Feature exposure metrics stabilized after deployment.

---

### 10:41 - Monitoring Recovery

Search success rate returning to expected baseline.

API latency normalized across all regions.

---

### 10:46 - Incident Resolved

Search platform functioning normally.

Incident status changed to Resolved.

---

### 10:55 - Follow-Up Actions

Action items created for:
- feature flag integration testing
- rollout exposure validation
- deployment safeguard improvements
- feature exposure monitoring
