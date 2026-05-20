# search-experience-service

Production incident simulation repository.

This project simulates a realistic backend production incident where a feature flag condition was accidentally inverted during a controlled rollout of a new search experience.

The issue caused the unfinished search system to be enabled for all users instead of the intended 5% rollout group, resulting in elevated error rates, failed search requests, and degraded customer experience.

---

# Architecture

+----------------------+     +-----------------------------+     +----------------------+
|  User Search Traffic |---->| search-experience-service   |---->|  Search Backend      |
|      (API Gateway)   |     |      (Node.js / Lambda)     |     |  (ElasticSearch)     |
+----------------------+     +-----------------------------+     +----------------------+

---

# Components

src/search_handler.js - Search request routing and feature flag handling  
config/env.example - Environment configuration template  
docs/RCA.md - Root cause analysis documentation  
docs/aws-log-snippet.txt - CloudWatch production logs  
docs/slack-thread.md - Incident investigation discussion  
docs/jira-ticket.md - Jira incident summary  
docs/incident-timeline.md - Full production timeline  

---

# Search Flow

1. User search request received
2. Feature flag evaluated
3. Search engine selected
4. Query processed
5. Search results returned
6. Metrics and logs emitted to CloudWatch

---

# Incident Simulation

This repository contains the evolution of a realistic production outage caused by incorrect feature flag logic during a staged rollout.

---

# Stage 1 - Stable Search Experience

Commit: Implement feature flag controlled search rollout

The existing search system remained default while the new search platform was gradually enabled for limited users.

---

# Stage 2 - Feature Flag Bug Introduced

Commit: Roll out new search experience to pilot users

A feature flag condition was accidentally inverted during rollout implementation.

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

This caused:
- new search enabled for all users
- massive increase in search errors
- elevated backend failures
- degraded search experience
- production instability

---

# Why it passed local testing

Local testing validated only feature-enabled scenarios and did not simulate production rollout percentages.

The feature flag service returned valid responses, so the logic appeared functional during development testing.

---

# Why it bypassed detection

- No rollout percentage validation existed
- Feature flag logic lacked automated tests
- CI/CD pipeline did not validate feature exposure percentages
- Code review focused primarily on search functionality
- Monitoring focused on availability instead of rollout behavior

---

# Stage 3 - Hotfix & Prevention

Commit: Correct feature flag logic for new search rollout

Fixes added:
- corrected rollout condition
- rollout percentage validation
- feature exposure monitoring
- rollback safeguards

---

# Monitoring Metrics

During the incident, these metrics degraded significantly:

| Metric | Normal | Incident |
|--------|--------|----------|
| search_success_rate | 99% | 63% |
| search_error_rate | low | 5x increase |
| new_search_requests | 5% traffic | 100% traffic |
| API latency | 120ms | 1400ms |
| customer complaints | low | elevated |

---

# Lessons Learned

- Feature flag logic must always be tested thoroughly.
- Rollout percentages should be validated automatically.
- Monitoring should detect abnormal feature exposure immediately.
- Controlled rollouts can fail catastrophically due to simple logic errors.
- Feature flags require the same review rigor as core business logic.

---

# Repository Structure

search-experience-service/
├── src/
│   └── search_handler.js
├── docs/
│   ├── jira-ticket.md
│   ├── slack-thread.md
│   ├── incident-timeline.md
│   ├── RCA.md
│   └── aws-log-snippet.txt
├── config/
│   └── env.example
├── package.json
├── README.md
└── .gitignore

---

# License

MIT - For educational and portfolio use only.
