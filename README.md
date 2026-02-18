# Production Work Order Scheduler

A high-performance, reactive timeline application built with **Angular 19.1** and **NgRx Signal Store**. This application allows production managers to visualize, create, and manage work orders across multiple work centers with real-time overlap validation.

You can test the app via netlify: [text](https://work-orders-timeline.netlify.app/work-orders)

## 🚀 Key Features

* **Reactive State Management**: Powered by `@ngrx/signals` for lightweight, signal-based state.
* **Dynamic Timeline**: Interactive timeline visualization.
* **Intelligent Validation**: Real-time scheduling conflict detection (overlap prevention).
* **Modern UI**: Eye-catching overlays, slide-out panels, and Circular Std typography.

## 🛠️ Tech Stack

* **Framework**: Angular 19.1 (Standalone Components)
* **State**: NgRx Signal Store (`withState`, `withMethods`, `rxMethod`)
* **Styling**: SCSS
* **UI Components**: NgbDatepicker (custom formatted), Ng-Select
  Change Detection: OnPush Strategy (optimized performance with Signals)
* **Forms**: Reactive Forms (Type-safe validation and dynamic patching)

## 📦 Installation

1. **Clone the repository**
2. **Install dependencies**
   ```bash
   npm install

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building

To build the project run:

```bash
ng build
```

## 🧠 Architectural Approach

This application follows a clear separation of concerns between state management, page orchestration, and presentational UI components.

Signal Store–driven State Management

The core application state is managed using NgRx Signal Store (@ngrx/signals) instead of classic NgRx reducers/effects.

**Signal Store** was chosen because of the:

* Native Signals integration – aligns with Angular 17+ reactive primitives

* Lower boilerplate compared to reducers/actions/effects

* Synchronous, predictable state updates (ideal for timelines)

* Fine-grained reactivity – only affected UI parts re-render

* Excellent performance with OnPush change detection

The store is responsible for:

* Holding work orders and work centers

* Performing create / update / delete operations

* Providing derived state (computed selectors) for the timeline

**Important design decision:**
The Signal Store is injected only at the page level, not inside reusable UI components.

This keeps UI components pure, reusable, and easy to test.
* State lives at the page level.
* UI components render and emit events.
* The store orchestrates logic.

## ♿ Accessibility

The application includes several accessibility-first decisions:

* Proper ARIA roles for dialogs and panels

* Keyboard navigation support on creation panel and confirm dialog

* Escape-to-close behavior via reusable directives

* Focus management (auto-focus, safe defaults)

* Scroll containment to avoid layout overflow

* Cool transitions between elements and view-changes
* 
## 📱 Responsiveness

Special care was taken to ensure that the application remains usable, responsive, and accessible on smaller screens, including mobile devices.

While the core layout is designed to be pixel-perfect for desktop, responsive adjustments were implemented to:

* Preserve horizontal scrolling where needed (e.g. timeline view)

* Maintain readable typography and spacing on smaller screens

* Ensure interactive elements remain reachable and navigable

As a result, the application is also navigable on mobile devices and maintains accessibility best practices, even under constrained screen sizes.

## ⚠️ Considerations & Trade-offs
### Medium Font Weight & Typography Adjustments

While implementing the UI with pixel-perfect intent, there were cases where the exact font weights defined in the design system were not visually optimal or not available with the provided font files.

As a result:

* In some areas, font-weight: 500 was used instead of the originally specified value

* Minor weight adjustments were applied to improve:

* Readability

* Visual balance

* Consistency across browsers and screen resolutions

* These adjustments were made intentionally to preserve the overall visual hierarchy and UX quality rather than blindly following numeric font weights.

### Timeline Interaction: Date Selection via Rectangle

Based on the design, users can select a date range for a new work order by clicking on the timeline while seeing a rectangle.

This way, by clicking the rectangle:

* We calculate startDate and endDate based on pixel offset

* Open the creation panel immediately

This approach:

* Removes friction from date selection

* Keeps the interaction fully visual

* Matches modern scheduling UX patterns

### Form Prefill & Default State Behavior

When creating a new work order from the timeline:

* startDate and endDate are pre-filled based on the selected rectangle

* The status field is automatically set to open

* The name field is intentionally left empty for user input

This ensures:

* A clear, guided creation flow

* Minimal required user input

### ♿ Datepicker Keyboard Interaction

During development, I identified a limitation related to keyboard accessibility when using the datepicker component.

❗ **Identified Issue**

While basic keyboard navigation (e.g. arrow keys, page navigation) is supported inside the datepicker, opening the datepicker dialog itself purely via keyboard is not reliably achievable without an explicit trigger element.

Relying on non-standard key combinations (e.g. ArrowDown, Alt + Key) to open the calendar:

* Is inconsistent across browsers

* Is not discoverable for users

* Does not align with WAI-ARIA accessibility best practices

### 🎨 Design Constraint

The original design did not include a dedicated button or icon to open the datepicker dialog.
This made it difficult to provide a fully accessible, keyboard-only interaction while preserving the pixel-perfect design.

## Final Notes

This project was implemented entirely by me, from architecture and state management to UI, interactions, and accessibility considerations.

It was a challenging task, especially given the focus on timeline logic, pixel-perfect UI, keyboard accessibility, and performance using modern Angular features.

### With additional time, several areas could be further refined, such as:

* Date calculation accuracy across all timeline views

The month view is fully implemented and prioritized, as it represents the most important and commonly used planning perspective. Other views (day, week, hour) are functionally consistent and visually stable, but could be further refined to handle more edge cases and fine-grained date alignment.

* Extended edge-case handling and testing

Additional scenarios (e.g. long-running work orders spanning multiple ranges, extreme zoom levels) could be further validated with more time.

* Timeline scrolling enhancements

While horizontal scrolling is supported and functional, more advanced scroll behaviors (e.g. smoother inertia, snap-to-date, or optimized centering strategies) could be added in a future iteration.

* Timeline visual affordances for very small ranges

The original design did not specify how extremely small ranges (e.g. a single-month-sized rectangle or minimal column widths) should be visually represented. To avoid over-engineering and losing focus, this was intentionally not expanded further. Instead, priority was given to functional correctness, interaction clarity, and overall UX consistency.

That said, this implementation represents a fully functional, responsive demo that demonstrates the intended behavior, interaction patterns, and overall UX direction of a production-ready work order scheduling system.
