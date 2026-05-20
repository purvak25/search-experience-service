# Root Cause Analysis: SEARCH-5124

**Incident:** New search experience unintentionally enabled for all users  
**Date:** 2024-07-11  
**Duration:** 42 minutes (10:04 - 10:46 UTC)  
**Severity:** P1 - Critical  
**Status:** Resolved  

---

# 1. Incident Summary

On July 11, 2024, the `search-experience-service` unintentionally enabled the new search platform for all production users during a staged rollout deployment.

The rollout was intended for only 5% of traffic, but an inverted feature flag condition caused 100% of users to receive the unfinished search experience.

This resulted in elevated search failures, increased backend timeouts, degraded API latency, and widespread customer impact.

---

# 2. Timeline

| Time (UTC) | Event |
|------------|-------|
| 09:50 | Rollout deployment completed |
| 10:04 | CloudWatch alarms triggered for search failures |
| 10:11 | Incident escalated to Platform and SRE teams |
| 10:17 | Root cause identified (inverted feature flag condition) |
| 10:24 | Rollback initiated |
| 10:36 | Hotfix deployed to production |
| 10:41 | Search metrics normalized |
| 10:46 | Incident resolved |

---

# 3. Root Cause

A rollout implementation in `src/search_handler.js` introduced an inverted feature flag condition during deployment of the new search experience.

Broken implementation:

```javascript
if (!featureFlagEnabled) {
   enableNewSearch();
}
```

Expected implementation:

```javascript
if (featureFlagEnabled) {
   enableNewSearch();
}
```

The inverted condition caused users without the rollout flag enabled to receive the unfinished search experience.

### Why it passed local testing

Local testing validated only feature-enabled scenarios and did not simulate actual rollout percentages.

The feature flag service returned valid responses, so the workflow appeared correct during development testing.

### Why it bypassed detection

- No rollout exposure validation existed
- Feature flag logic lacked automated integration tests
- CI/CD pipeline did not validate rollout percentages
- Code review focused primarily on search functionality
- Monitoring focused on availability instead of feature exposure behavior

### Why it caused widespread production impact

The unfinished search backend was not prepared for full production traffic volume.

This caused:
- elevated search failures
- backend timeout spikes
- degraded customer experience
- increased API latency
- unstable search behavior

---

# 4. Technical Impact

- New search exposure increased from intended 5% to 100%
- Search API failure rate increased 5x above baseline
- Elevated ElasticSearch timeout errors observed
- API latency increased significantly across production regions
- Search request success rate dropped from 99% to 63%
- Backend concurrency increased unexpectedly

### Error Types Observed

- `Search backend timeout`
- ElasticSearch `503 Service Unavailable`
- elevated API latency alerts
- feature exposure threshold warnings

---

# 5. Business Impact

- Customers experienced degraded search functionality
- Search results intermittently failed across production
- Customer complaint volume increased significantly
- Product rollout confidence impacted
- Engineering and SRE teams diverted from sprint work
- Search experience SLAs temporarily breached

---

# 6. Resolution

- Corrected feature flag condition
- Reduced rollout exposure back to intended percentage
- Added rollout percentage validation
- Added feature exposure monitoring
- Added deployment rollback safeguards
- Redeployed hotfix to production

Hotfix deployed within 19 minutes of root cause identification.

---

# 7. Preventive Actions

| Action | Owner | Ticket | Target Date |
|--------|-------|--------|-------------|
| Add feature flag integration tests | Backend | SEARCH-5125 | 2024-07-15 |
| Add rollout percentage validation | Platform | SEARCH-5126 | 2024-07-13 |
| Add feature exposure monitoring | SRE | SEARCH-5127 | 2024-07-12 |
| Improve rollout safeguard automation | Platform | SEARCH-5128 | 2024-07-16 |
| Add deployment smoke testing | QA | SEARCH-5129 | 2024-07-18 |
| Expand rollback validation checks | DevOps | SEARCH-5130 | 2024-07-14 |

---

# 8. Lessons Learned

- Feature flag logic requires strict validation.
- Rollout percentages should always be verified automatically.
- Monitoring should detect abnormal feature exposure immediately.
- Controlled rollouts can fail catastrophically due to small logic errors.
- Feature flags require the same review rigor as core business logic.
- Rollback safeguards should exist for all production feature deployments.

---

# 9. Attachments

- AWS Log Snippet
- Slack Thread
- Jira Ticket
- Incident Timeline
