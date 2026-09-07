# Problem 2 — Technical Approach

1.  **Leave Selection**: Leave Management was chosen as it represents the core interactive transaction connecting employees (requesters) and managers (approvers) in a mid-sized organization.
2.  **Design Influence**: The UX requirements for visual heroes (leave balances) and layout grids guided our creation of modular UI widgets (Button, Card, Modal) styled with custom CSS variables.
3.  **Workflow Hookup**: State is coordinated via `useLeaveRequests.ts`, acting as the single source of truth that refreshes views immediately when a request status changes.
4.  **Persistence**: Built using a service abstraction (`storage.ts`) wrapping `localStorage`. Initial runs auto-seed mock data with fictional Indian employee records.
5.  **Code Structure**: Separated into components (ui, layout, leave), pages (dashboards, landing), services (persistence, business logic), types, and utilities (date diffs, input validation).
6.  **Out of Scope**: Real LDAP/AD user authentication, backend REST APIs, DB transactions, overlap email alerts, and multi-currency payroll rules are mocked or handled on the client-side.
7.  **Future Enhancements**: With more time, we would implement standard RBAC middleware, JWT auth, a PostgreSQL relational database, and automatic notification heartbeats.
