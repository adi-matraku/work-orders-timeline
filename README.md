# Production Work Order Scheduler

A high-performance, reactive timeline application built with **Angular 19.1** and **NgRx Signal Store**. This application allows production managers to visualize, create, and manage work orders across multiple work centers with real-time overlap validation.

## 🚀 Key Features

* **Reactive State Management**: Powered by `@ngrx/signals` for lightweight, signal-based state.
* **Dynamic Timeline**: Interactive timeline visualization.
* **Intelligent Validation**: Real-time scheduling conflict detection (overlap prevention).
* **Modern UI**: Eye-catching overlays, slide-out panels, and Circular Std typography.

## 🛠️ Tech Stack

* **Framework**: Angular 19.1 (Standalone Components)
* **State**: NgRx Signal Store (`withState`, `withMethods`, `rxMethod`)
* **Styling**: SCSS with CSS Variables & Absolute Positioning
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

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```
