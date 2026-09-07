# Submission Checklist — PeopleOS

This checklist verifies that the internship assignment complies with all specifications.

## 1. Core Architecture & Stack
*   [x] Vite + React + TypeScript initialized.
*   [x] Strict folder structure implemented (components/ui, components/leave, pages, hooks, services, utils, types).
*   [x] Zero paid dependencies; built using free, open-source packages (`lucide-react`) and native web APIs.
*   [x] CSS custom variables style tokens mapped (colors, spacing, typography).

## 2. Dashboards (Role-Based)
*   [x] **Landing Page**: Simulated login portal with clear descriptions of Employee, Manager, and HR roles.
*   [x] **Employee Dashboard**: Welcomes Ananya Sharma, displays leave balances as cards, visualizes career growth (82%), and displays timeline events.
*   [x] **Manager Dashboard**: Welcomes Arjun Mehta, displays team size (24) and attendance counters, visualizes weekly roster availability, and lists direct reports' pending requests.
*   [x] **HR Dashboard**: Welcomes Priya Nair, displays headcount distribution (Engineering 180, Sales 120, etc.), recruitment metrics, and action alerts.

## 3. Leave Management Module (Functional)
*   [x] **Balances Seeded**: Annual (30 total, 12 remaining), Sick (10 total, 7 remaining), Personal (5 total, 3 remaining).
*   [x] **Form Details**: Submits leave type, start date, end date, automatically calculated duration, and reason.
*   [x] **Validation Rules**:
    *   [x] Fields marked required.
    *   [x] End date cannot be before start date.
    *   [x] Duration must be at least 1 day.
    *   [x] Date range is checked for overlaps with existing requests.
    *   [x] Duration checked against remaining balance (prevents submit if insufficient).
*   [x] **Approval Workflow**: Deducts leave balance from the employee's record, updates list status, saves in localStorage, and triggers toast.
*   [x] **Rejection Workflow**: Requests rejection comments, changes list status, leaves balance untouched, saves in localStorage, and triggers toast.
*   [x] **Details Modal**: Allows managers to view employee bio, leave details, and employee balances, and action approvals/rejections directly.

## 4. Quality & Verification
*   [x] Clean compilation: Checked with build/lint script command runs.
*   [x] Persistence: Refreshing browser preserves active requests, balances, and active role configurations.
*   [x] Responsiveness: Supported for mobile (390px sidebar overlay/collapsing), tablet (768px), and desktop (1440px).
*   [x] Accessibility: Uses semantic HTML tags, keyboard navigability for buttons/inputs, screen-reader focus trap in modals, and color-independent badges.
