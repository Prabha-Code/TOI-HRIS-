# Problem 1 — UX Design & Architecture

## Product Overview
**PeopleOS** is a comprehensive Human Resource Information System (HRIS) designed for a mid-sized organization of approximately 500 employees. Our tagline, *"One place to understand your people, act on priorities, and keep work moving,"* encapsulates our product philosophy: combining high-level organizational intelligence with individual actionability to remove daily workplace friction.

---

## Personas & Priorities

### 1. HR Administrator (Priya Nair)
*   **Responsibility**: Core workforce management, compliance checks, payroll administration, candidate pipelines, and overall organization health.
*   **Key Needs**:
    *   Organization-wide macro views (headcount, overall leave numbers, positions).
    *   Task-oriented notifications (exception monitoring, payroll triggers, outstanding onboarding).
    *   Fast lookup and system shortcuts to action items.
*   **UX Philosophy**: Analytical overview combined with transactional efficiency.

### 2. Team Manager (Arjun Mehta)
*   **Responsibility**: Delivery throughput, team availability, leave approvals, career feedback, and local hiring goals.
*   **Key Needs**:
    *   Real-time team presence rosters (knowing who is out today/this week to balance workloads).
    *   Frictionless approval workflows (actioning requests with context).
    *   Performance scoring overview.
*   **UX Philosophy**: Group health dashboard with quick validation gates.

### 3. Employee (Ananya Sharma)
*   **Responsibility**: Personal profile updates, timesheets, requesting leaves, looking up payslips, tracking goals.
*   **Key Needs**:
    *   Highly visible leave balance display ("hero metric").
    *   Clear timeline of upcoming corporate milestones (reviews, paydays).
    *   Simple, guided leave submission forms.
*   **UX Philosophy**: High-clarity individual dashboard focused on personal tasks.

---

## User Journeys

### HR Journey (Priya)
1.  **Dashboard Entry**: Welcomed with macro KPIs: total headcount (500), number of employees currently on leave (18), open reqs (12), and actions waiting (24).
2.  **Attention Feed**: Renders active indicators (e.g., total pending leave requests system-wide, upcoming review batches).
3.  **Department Breakdown**: Views visual charts showing engineering (180), sales (120), operations (95), marketing (55), and HR (30) headcounts.
4.  **Action Paths**: Directly initiates "Run Payroll" or "Add Employee" with primary page actions.

### Manager Journey (Arjun)
1.  **Roster Check**: Reviews team size (24), team members present today (21), and those on leave (3).
2.  **Roster Calendar**: Scans a Monday-Friday micro calendar showing staffing limits (e.g., 3 people on leave on Tuesday, 1 on Friday).
3.  **Leave Verification**:
    *   Identifies a pending request from Rahul Menon (Annual Leave, Aug 18–Aug 20, 3 days).
    *   Launches the **Details Modal** to check Rahul's remaining annual leave balance (18 days remaining) and reasons ("Family function in Kerala").
    *   Appoints backup or clicks **Approve** directly.
4.  **Review Cycle**: Scans upcoming reviews (e.g., Rahul Menon, Amit Patel) and logs metrics.

### Employee Journey (Ananya)
1.  **Balance Overview**: Enters dashboard and instantly sees remaining days for Annual (12), Sick (7), and Personal (3) leaves.
2.  **Request Submission**:
    *   Clicks **Request Leave** to open the modal.
    *   Selects "Annual Leave" and inputs dates (e.g., Aug 25–Aug 27).
    *   The system automatically calculates 3 days duration and cross-references it against her 12-day balance.
    *   Writes a reason and clicks **Submit**.
3.  **State Tracker**: View shows the request added in `Pending` status.
4.  **Manager Decision Reflection**: Once Arjun approves, Ananya's balance is automatically updated (Annual Leave remaining decrements to 9 days) and the status reflects `Approved` with a success toast.

---

## Dashboard Information Hierarchy & Rationale

*   **Role-Based Partitioning**: Rather than tweaking a greeting, we built three dashboards containing completely distinct data structures, visual layouts, and actions.
*   **Visual Heroes**:
    *   **Employee**: Leave Balance cards are styled with distinct category icons, colored progress bars, and giant text because leave management is the primary transactional friction point for employees.
    *   **Manager**: Team availability timelines are placed side-by-side with pending approvals because managers must cross-check team bandwidth before granting approvals.
    *   **HR**: Headcount widgets and macro metrics are prioritized because administrative roles require aggregate data rather than single-person details.
*   **Simplicity and Cleanliness**: Clean typography (Inter), rounded boxes (12-16px), subtle border lines (`#E5E7EB`), and restrained shadows ensure a highly premium, modern, and uncluttered enterprise design.
