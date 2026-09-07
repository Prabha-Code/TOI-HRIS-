# Figma Design Specification — PeopleOS

This design spec provides all necessary measurements, tokens, layouts, and prototype paths for a designer to reproduce the **PeopleOS** interface in Figma.

---

## 1. Frame Setup & Layout Grid

### Frame Sizes
*   **Desktop Frame**: 1440px width × 1024px height (Standard Desktop View)
*   **Tablet Frame**: 768px width × 1024px height (iPad Vertical)
*   **Mobile Frame**: 390px width × 844px height (iPhone 13/14 Pro)

### Layout Grid (Desktop)
*   **Columns**: 12 Columns
*   **Gutter**: 24px
*   **Margin**: 32px (Left & Right)
*   **Grid Type**: Center/Stretch

---

## 2. Design Tokens

### Color Palette (Figma Library Swatches)

| Token Name | Hex Code | Usage |
| :--- | :--- | :--- |
| **Background** | `#F7F8FA` | App workspace canvas background |
| **Surface** | `#FFFFFF` | Card backdrops, sidebar panel, input inputs |
| **Primary** | `#4F46E5` | Active items, main CTAs, brand accents (Indigo 600) |
| **Primary Hover** | `#4338CA` | Hover state for primary buttons |
| **Text (Main)** | `#111827` | Headings, body copies (Slate 900) |
| **Secondary Text**| `#6B7280` | Subtitles, labels, secondary info (Slate 500) |
| **Border** | `#E5E7EB` | Dividers, card boundaries, input lines (Slate 200) |
| **Success** | `#16A34A` | Approved status badge, green indicators (Green 600) |
| **Warning** | `#D97706` | Pending approval badge, yellow alerts (Amber 600) |
| **Danger** | `#DC2626` | Rejected status badge, error text, critical actions |
| **Info** | `#2563EB` | Neutral info banners, tags |

### Spacing System (8px Grid)
*   `8px` (XS) – Icon-to-text spacing, small badges.
*   `12px` (SM) – Inner button margins, list item gap.
*   `16px` (MD) – Grid spacing inside forms, card headers.
*   `20px` (ML) – Card interior padding.
*   `24px` (LG) – Card-to-card gap, page title margins.
*   `32px` (XL) – Roster layouts, main panel padding.

### Border Radii
*   `8px` – Input inputs, small tags, mini progress bars.
*   `12px` – Action buttons, dropdown lists, small cards.
*   `16px` – Standard content cards, main container panels, dialog modals.

### Shadows
*   `Shadow-sm`: `0px 1px 2px rgba(0, 0, 0, 0.05)`
*   `Shadow-md`: `0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)`
*   `Shadow-lg`: `0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)`
*   `Shadow-xl`: `0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)`

---

## 3. Typography Styles (Inter Family)

*   **H1 (Page Titles)**: Inter Bold, 32px / line-height: 40px / letter-spacing: -0.02em
*   **H2 (Section Titles)**: Inter Bold, 24px / line-height: 32px / letter-spacing: -0.01em
*   **H3 (Card Titles)**: Inter SemiBold, 18px / line-height: 28px
*   **Body (Default Text)**: Inter Regular, 14px / line-height: 20px
*   **Body SemiBold**: Inter SemiBold, 14px / line-height: 20px
*   **Caption (Labels, Subtexts)**: Inter Medium, 12px / line-height: 16px

---

## 4. Prototype Flow Mappings

### Flow 1: Leave Submission (Employee)
1.  **Frame: Employee Dashboard**
    *   *Trigger*: Click `Request Leave` button (Indigo, top-right).
    *   *Action*: Open Overlay (Center) -> **Frame: Request Leave Modal**.
2.  **Frame: Request Leave Modal**
    *   *Trigger*: Input fields (Type: Annual, Start: Aug 25, End: Aug 27, Reason: Vacay).
    *   *Action*: Display automatic text: `3 days` with `Submit` button active.
    *   *Trigger*: Click `Submit Leave Request` button.
    *   *Action*: Close Overlay + Trigger Toast -> `Toast: Leave request submitted successfully! (success)`.
3.  **Frame: Employee Dashboard (Updated)**
    *   *Transition*: Live update lists.
    *   *Action*: "Your Leave Request History" grid displays a new card in **Pending Approval** state (Amber badge).

### Flow 2: Leave Approval (Manager)
1.  **Frame: Manager Dashboard**
    *   *Trigger*: Renders "Pending Leave Requests (2)".
    *   *Action*: Click `View Details` text button on Rahul Menon's card.
    *   *Action*: Open Overlay (Center) -> **Frame: Leave Request Details Modal**.
2.  **Frame: Leave Request Details Modal**
    *   *Display*: Renders Rahul's avatar, 3-day request, and current leave balance (18 days left).
    *   *Trigger*: Click `Approve Request` button (Green, bottom-right).
    *   *Action*: Close Overlay + Trigger Toast -> `Toast: Leave request approved successfully. (success)`.
3.  **Frame: Manager Dashboard (Updated)**
    *   *Display*: "Pending Leave Requests" counter updates to `1`.
    *   *Display*: "Working Today" metric is updated if date matches.
4.  **Frame: Switch Role to Employee**
    *   *Display*: Renders Employee Dashboard.
    *   *Display*: Ananya's balance is updated if the approved request belongs to her. Rahul Menon's balance is updated in local state.

---

## 5. UI States Reference

### Button States
*   **Default**: Colored background (`var(--color-primary)`), sharp contrast.
*   **Hover**: Slightly darker background (Scale factor 0.95 or `var(--color-primary-hover)`).
*   **Focus**: `3px` glow ring with `rgba(79, 70, 229, 0.4)`.
*   **Disabled**: Opacity `0.6`, cursor changed to `not-allowed`.
*   **Loading**: Spinning SVG inline, button text changes to "Loading...".

### Status Badges
*   **Pending**: Background `#FEF3C7`, Text `#B45309`, Border `#FDE68A`.
*   **Approved**: Background `#DCFCE7`, Text `#15803D`, Border `#BBF7D0`.
*   **Rejected**: Background `#FEE2E2`, Text `#B91C1C`, Border `#FCA5A5`.
