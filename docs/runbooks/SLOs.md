# SmartNivad Operational SLOs

Service Level Objectives (SLOs) are measurable targets for system reliability. If we violate these targets, feature development must halt until reliability is restored.

| Metric                              | Target     | Definition                                                       |
| ----------------------------------- | ---------- | ---------------------------------------------------------------- |
| **Uptime**                          | `99.9%`    | Percentage of time the core site and APIs respond with 200 OK.   |
| **API Latency (p95)**               | `< 300 ms` | 95% of all API requests must complete in under 300 milliseconds. |
| **LCP (Largest Contentful Paint)**  | `< 2.5 s`  | Standard Core Web Vitals target for rendering primary content.   |
| **INP (Interaction to Next Paint)** | `< 200 ms` | Standard Core Web Vitals target for UI responsiveness.           |
| **Error Rate**                      | `< 0.5%`   | Percentage of requests resulting in a 5xx HTTP status code.      |

## Error Budgets

A 99.9% uptime target allows for **43 minutes** of downtime per month.
If this error budget is exhausted, deployments must be frozen (except for hotfixes) until the next calendar month.
