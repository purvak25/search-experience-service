# Slack Thread

**Channel:** #incidents-search-platform  
**Date:** 2024-07-11

---

**10:04 AM — SRE Engineer**

CloudWatch alarms triggered for elevated search API failures.

Search latency also increasing across production regions.

---

**10:06 AM — Product Manager**

Customer complaints coming in about broken search results and empty responses.

Wasn't the new search supposed to be enabled for only 5% of users?

---

**10:08 AM — Backend Engineer**

Checking rollout deployment now.

Feature flag rollout patch deployed around 09:50.

---

**10:11 AM — Platform Engineer**

New search traffic currently showing 100% exposure instead of expected 5%.

Feature exposure metrics look incorrect.

---

**10:13 AM — Backend Engineer**

Found suspicious rollout logic in search_handler.js

Current implementation:

```javascript
if (!featureFlagEnabled) {
   enableNewSearch();
}
```

Condition appears inverted.

---

**10:16 AM — Team Lead**

So users without the feature flag are getting the new search experience?

---

**10:17 AM — Backend Engineer**

Yes.

The rollout condition is reversed.

New search was unintentionally enabled globally after deployment.

---

**10:20 AM — SRE Engineer**

Search error rate increased 5x above baseline.

Backend timeout alerts also firing continuously.

---

**10:24 AM — Platform Engineer**

Rolling back feature exposure now.

Traffic gradually shifting back to stable search platform.

---

**10:28 AM — Backend Engineer**

Preparing hotfix.

Adding:
- corrected rollout condition
- rollout percentage validation
- feature exposure monitoring

---

**10:36 AM — SRE Engineer**

Error rates beginning to normalize.

Latency improving after rollback.

---

**10:41 AM — Platform Engineer**

Traffic now back to expected 5% rollout target.

Feature exposure metrics stable.

---

**10:46 AM — Team Lead**

Incident resolved.

Please prepare RCA and rollout validation improvements before next deployment window.
