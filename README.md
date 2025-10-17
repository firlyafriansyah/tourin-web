# Tourin Web

> A lightweight, elegant guided tour library for React applications — perfect for creating seamless onboarding experiences and highlighting key features.

[![npm version](https://img.shields.io/npm/v/tourin-web.svg)](https://www.npmjs.com/package/tourin-web)

**[Landing Page](https://tourin-web.zfr.dev)** • **[Live Demo](https://stackblitz.com/edit/tourin-web)** • **[NPM Package](https://www.npmjs.com/package/tourin-web)**

---

## Why Tourin Web?

Tourin Web makes it effortless to create interactive product tours that guide your users through your application. With minimal configuration and smooth animations, you can enhance user engagement and reduce the learning curve for new features.

### Key Features

- **Precise Targeting** — Highlight any element using simple CSS selectors
- **Lightning Fast Setup** — Get started in under 5 minutes
- **Fully Customizable** — Adjust colors, sizes, and styling to match your brand
- **Smooth Animations** — Beautiful transitions powered by Framer Motion
- **Hook-Based Control** — Intuitive API using React hooks
- **Responsive** — Works seamlessly across all device sizes
- **Zero Dependencies** — Minimal footprint, maximum performance

---

## Quick Start

### Installation

Install Tourin Web via your preferred package manager:

```bash
npm install tourin-web
```

---

## Complete Guide

### Step 1: Define Your Tour Steps

Create an array of step objects, each describing what to highlight and the information to display:

```tsx
const tourSteps = [
  {
    selector: "#welcome-section",
    title: "Welcome to Our App!",
    content:
      "Let's take a quick tour to help you get started with the key features.",
  },
  {
    selector: "#dashboard",
    title: "Your Dashboard",
    content:
      "This is your central hub where you can view all your important metrics and recent activity.",
  },
  {
    selector: "#create-button",
    title: "Create New Items",
    content:
      "Click here whenever you want to create something new. It's that simple!",
  },
];
```

### Step 2: Integrate Tourin Web

Import the hook and component, then integrate them into your React application:

```tsx
import React from "react";
import { useTourinWeb, TourinWeb } from "tourin-web";

export function Dashboard() {
  const { isRunning, startTour, stopTour } = useTourinWeb();

  return (
    <div>
      {/* Your application content */}
      <header id="welcome-section">
        <h1>Welcome Back!</h1>
      </header>

      <main id="dashboard">{/* Dashboard content */}</main>

      <button id="create-button">Create New</button>

      {/* Tour trigger */}
      <button onClick={startTour} className="help-button">
        Take a Tour
      </button>

      {/* Render tour when active */}
      {isRunning && (
        <TourinWeb
          start
          steps={tourSteps}
          size="lg"
          color="#3b82f6"
          onFinish={stopTour}
        />
      )}
    </div>
  );
}
```

### Step 3: Launch the Tour

Trigger the tour programmatically based on your application logic:

```tsx
// On button click
<button onClick={startTour}>Start Tour</button>;

// On component mount (first-time users)
useEffect(() => {
  const hasSeenTour = localStorage.getItem("hasSeenTour");
  if (!hasSeenTour) {
    startTour();
    localStorage.setItem("hasSeenTour", "true");
  }
}, []);

// After successful login
const handleLogin = async () => {
  await loginUser();
  startTour();
};
```

---

## API Reference

### `useTourinWeb()` Hook

A React hook that provides tour control functions and state.

**Returns:**

| Property    | Type         | Description                                    |
| ----------- | ------------ | ---------------------------------------------- |
| `startTour` | `() => void` | Initiates the guided tour                      |
| `stopTour`  | `() => void` | Ends the tour immediately                      |
| `isRunning` | `boolean`    | Indicates whether the tour is currently active |

**Example:**

```tsx
const { isRunning, startTour, stopTour } = useTourinWeb();

// Start tour
startTour();

// Check if tour is running
if (isRunning) {
  console.log("Tour is active");
}

// Stop tour
stopTour();
```

---

### `<TourinWeb />` Component

The main component that renders the tour overlay and tooltips.

**Props:**

| Prop       | Type                                   | Required | Default     | Description                                          |
| ---------- | -------------------------------------- | -------- | ----------- | ---------------------------------------------------- |
| `steps`    | `TourStep[]`                           | Yes      | —           | Array of tour step configurations                    |
| `start`    | `boolean`                              | No       | `false`     | Auto-start the tour when component mounts            |
| `onFinish` | `() => void`                           | Yes      | —           | Callback function invoked when tour completes        |
| `color`    | `string`                               | No       | `"#3b82f6"` | Hex color for highlight border and navigation button |
| `size`     | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | No       | `"md"`      | Tooltip size preset                                  |

**TourStep Interface:**

```typescript
interface TourStep {
  selector: string; // CSS selector for the target element
  title: string; // Step title displayed in tooltip
  content: string; // Descriptive text for the step
  action?: string; // Optional action hint
  delayed?: string; // Optional delay before showing
}
```

---

## Advanced Examples

### Custom Styling

```tsx
<TourinWeb
  start
  steps={steps}
  size="xl"
  color="#10b981" // Emerald green
  onFinish={stopTour}
/>
```

### Conditional Tour Launch

```tsx
function App() {
  const { isRunning, startTour, stopTour } = useTourinWeb();
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    // Check if user is visiting for the first time
    const visited = localStorage.getItem("visited");
    if (!visited) {
      setIsFirstVisit(true);
      localStorage.setItem("visited", "true");
      startTour();
    }
  }, [startTour]);

  return (
    <div>
      {/* Your app content */}

      {isRunning && (
        <TourinWeb
          start
          steps={steps}
          onFinish={() => {
            stopTour();
            setIsFirstVisit(false);
          }}
        />
      )}
    </div>
  );
}
```

### Multi-Page Tour

```tsx
const tourSteps = [
  {
    selector: "#home-section",
    title: "Home Page",
    content: "This is where your journey begins.",
  },
  {
    selector: "#profile-link",
    title: "Your Profile",
    content: "Click here to view and edit your profile settings.",
    action: "click",
  },
];

// Navigate between steps with custom logic
const handleStepChange = (stepIndex) => {
  if (stepIndex === 1) {
    navigate("/profile");
  }
};
```

---

## Technical Requirements

| Dependency        | Minimum Version             |
| ----------------- | --------------------------- |
| **React**         | `>=17.0.0`                  |
| **React DOM**     | `>=17.0.0`                  |
| **Framer Motion** | `>=12.0.0` (auto-installed) |

---

## Use Cases

- **User Onboarding** — Guide new users through your application's core features
- **Feature Announcements** — Highlight new functionality to existing users
- **Training & Education** — Create interactive tutorials for complex workflows
- **UX Research** — Direct user attention during testing sessions
- **Product Demos** — Showcase your application's capabilities

---

## Resources

- **[Landing Page](https://tourin-web.zfr.dev)** — Official website with examples and documentation
- **[Interactive Demo](https://stackblitz.com/edit/tourin-web)** — Try Tourin Web in your browser
- **[NPM Package](https://www.npmjs.com/package/tourin-web)** — View package details and download stats
- **[GitHub Issues](https://github.com/)** — Report bugs or request features

---

## License

MIT © Firly Afriansyah

---

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests to help improve Tourin Web.

---

**Made with ❤️ for the React community**
