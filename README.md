# Chat App — Frontend

A real-time chat application frontend built with React and Vite. It provides user authentication, one-to-one messaging with live delivery via SignalR, media sharing (images, video, voice messages), message replies, typing indicators, online/offline presence, user statuses, and account settings.

## Features

- **Authentication** — register/login flows backed by a REST API, with cookie-based sessions (`axios` + `withCredentials`).
- **Real-time messaging** — powered by [`@microsoft/signalr`](https://learn.microsoft.com/aspnet/core/signalr/introduction), including:
  - Instant message delivery
  - Typing indicators
  - User connected/disconnected presence events
- **Rich message composer** — emoji picker (`emoji-mart`), file uploads, video uploads, and voice recording.
- **Message interactions** — reply to messages, search within a conversation, scroll-to-bottom shortcut.
- **User statuses** — post and view statuses (similar to "stories").
- **Settings** — manage account/profile settings.
- **State management** — Redux Toolkit for global state, React Hook Form + Yup for form validation.
- **Notifications** — toast messages via `react-toastify`.

## Tech Stack

- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/) — dev server & build tool
- [React Router](https://reactrouter.com/) — routing
- [Redux Toolkit](https://redux-toolkit.js.org/) — state management
- [React Hook Form](https://react-hook-form.com/) + [Yup](https://github.com/jquense/yup) — form handling & validation
- [Axios](https://axios-http.com/) — HTTP client
- [SignalR](https://learn.microsoft.com/aspnet/core/signalr/introduction) — real-time communication
- [Emoji Mart](https://github.com/missive/emoji-mart) — emoji picker
- [SweetAlert2](https://sweetalert2.github.io/) — alert dialogs
- [React Icons](https://react-icons.github.io/react-icons/) — icon set
- [React Toastify](https://fkhadra.github.io/react-toastify/) — toast notifications

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- A running instance of the corresponding backend API (this project only contains the frontend)

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd chatAppFront
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root (or edit the existing one) with the URL of the backend API:

   ```env
   VITE_API_URL=http://localhost:5051
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

   The app will be available at the URL printed in the terminal (typically `http://localhost:5173`).

## Available Scripts

| Script            | Description                              |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Start the Vite development server         |
| `npm run build`   | Build the app for production              |
| `npm run preview` | Preview the production build locally      |
| `npm run lint`    | Run ESLint on the codebase                |

## Project Structure

```
src/
├── api.js                  # Auth API calls (login/register)
├── App.jsx                 # App routes
├── components/             # UI components (chat list, message input, uploaders, etc.)
├── hooks/                  # Custom hooks (SignalR connection, chat handlers, typing, scroll, etc.)
├── layouts/                # Page layouts (auth, main)
├── pages/                  # Route-level pages (Home, Login, Register, Settings, Statuses)
├── reducers/                # Local reducers (auth, login, register, user)
├── redux/                  # Redux store, actions
├── utils/                  # Utility helpers (local storage, etc.)
└── validations/            # Yup validation schemas
```

## Backend Connection

The app expects a backend API exposing:

- REST endpoints under `/api/auth` (`/register`, `/login`)
- A SignalR hub at `/hubs/chat` for real-time messaging, typing notifications, and presence events

Configure the backend base URL via the `VITE_API_URL` environment variable.
