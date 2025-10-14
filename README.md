# Tourin Web

**Tourin Web** is a lightweight and easy-to-use guided tour library for React applications — perfect for onboarding users or highlighting features on your web app.

---

## 🚀 Installation

```bash
npm install tourin-web
# or
yarn add tourin-web
```

---

## ✨ Features

- 🎯 Highlight any element using a simple CSS selector (`id` or `class`)
- ⚡ Minimal setup — ready in minutes
- 🧩 Fully controlled with hooks
- 💅 Smooth animations powered by Framer Motion

---

## 🧩 Usage

### 1. Prepare your tour steps

Each step defines what element to highlight and what content to show.

```tsx
const stepData = [
  {
    selector: "#login-content",
    title: "How to Login!",
    content:
      "First, you need an account to log in. Ask your superior to get the account credentials.",
  },
];
```

---

### 2. Import and initialize Tourin Web

Use the provided React hook `useTourinWeb` and the `TourinWeb` component.

```tsx
import { useTourinWeb, TourinWeb } from "tourin-web";

export function MyPage() {
  const { isRunning, startTour, stopTour } = useTourinWeb();

  return (
    <>
      {/* Your main UI */}
      <button onClick={startTour}>Start Tour</button>

      {/* Render the tour only when active */}
      {isRunning && (
        <TourinWeb start onFinish={stopTour} steps={stepData} color="#3b82f6" />
      )}
    </>
  );
}
```

---

### 3. Start the tour

Just call `startTour()` whenever you want to begin the walkthrough — for example, on a button click, after login, or on page load.

```tsx
startTour();
```

---

## 🧠 API Reference

### `useTourinWeb()`

Hook for controlling the tour flow.

| Function      | Description                              |
| ------------- | ---------------------------------------- |
| `startTour()` | Start the tour                           |
| `stopTour()`  | Stop or finish the tour                  |
| `isRunning`   | Boolean indicating if the tour is active |

---

### `<TourinWeb />`

Component responsible for rendering the tour UI.

| Prop       | Type                                                          | Description                               |
| ---------- | ------------------------------------------------------------- | ----------------------------------------- |
| `steps`    | `Array<{ selector: string, title: string, content: string }>` | List of tour steps                        |
| `start`    | `boolean (opsional - default: false)`                         | Whether to start the tour automatically   |
| `onFinish` | `() => void`                                                  | Callback triggered when the tour ends     |
| `color`    | `string (opsional - default: #3b82f6)`                        | Hex color for highlight border and button |

---

## 🧩 Example

```tsx
import React from "react";
import { useTourinWeb, TourinWeb } from "tourin-web";

const steps = [
  {
    selector: "#nav",
    title: "Navigation",
    content: "This is the main navigation bar.",
  },
  {
    selector: "#login-content",
    title: "Login",
    content: "Here you can log in to your account.",
  },
];

export default function App() {
  const { isRunning, startTour, stopTour } = useTourinWeb();

  return (
    <div>
      <nav id="nav">Navigation</nav>
      <div id="login-content">Login Area</div>

      <button onClick={startTour}>Start Guided Tour</button>

      {isRunning && <TourinWeb start onFinish={stopTour} steps={steps} />}
    </div>
  );
}
```

---

## 🧰 Requirements

| Dependency    | Minimum Version                  |
| ------------- | -------------------------------- |
| React         | `>=17`                           |
| React DOM     | `>=17`                           |
| Framer Motion | `>=12` (automatically installed) |

---

## 📜 License

MIT © Firly Afriansyah
