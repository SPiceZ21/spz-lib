<img src="https://github.com/SPiceZ21/spz-core-media-kit/raw/main/Banner/Banner%232.png" alt="SPiceZ-Core Banner" width="100%">

# spz-lib — Shared Utility Library

`spz-lib` is the foundational utility library for the **SPiceZ-Core** framework. It provides a unified set of tools, wrappers, and shared constants used across all `spz-*` modules. 

> **IMPORTANT**: This resource must be the first `spz-*` module loaded in your `server.cfg`.

---

## 🚀 Features

- **Promise-based Callbacks**: Clean client ↔ server request-response pattern with built-in timeouts (`TriggerAwait`).
- **Unified Notifications**: Swappable notification backends (`ox_lib`, `chat`, `nui`) via a single API.
- **Advanced Timers**: Cancellable one-shot, repeating, countdown, and debounce helpers.
- **Structured Logging**: Per-module bound loggers with automatic JSON serialization and runtime level toggling.
- **Mathematics & Vectors**: 3D/2D distance, heading calculations, and staggered race grid positioning logic.
- **Functional Helpers**: Extended table manipulation (`Map`, `Filter`, `DeepClone`) and string formatting tools.

---

## 📦 Installation

This resource requires `ox_lib` and `oxmysql`.

1. Ensure the dependencies are loaded before `spz-lib`.
2. Add the following to your `server.cfg`:

```cfg
ensure oxmysql
ensure ox_lib
ensure spz-lib       -- must come before all other spz-* modules
ensure spz-core
ensure spz-identity
-- ... other modules
```

---

## 🛠 Configuration

Edit `config.lua` to customize the library behavior:

- **NotifyBackend**: Choose between `ox_lib`, `chat`, or `nui`.
- **LogLevel**: Set the minimum logging level (0=DEBUG, 1=INFO, 2=WARN, 3=ERROR).
- **CallbackTimeout**: Global timeout for all callback requests.
- **Grid Spacing**: Adjust race start grid dimensions.

---

## 📚 API Reference

`spz-lib` exposes its utilities through a global `SPZ` table.

### Callbacks
- `SPZ.Callbacks.Register(name, fn)` — Register a named callback.
- `SPZ.Callbacks.Trigger(name, data, cb)` — Trigger a server callback (Client).
- `SPZ.Callbacks.TriggerAwait(name, data)` — Awaitable version for coroutines.

### Notify
- `SPZ.Notify(message, type, duration)` — Show local notification.
- `SPZ.Notify(source, message, type, duration)` — Send notification to player (Server).
- `SPZ.NotifyAll(message, type, duration)` — Broadcast notification (Server).

### Timers
- `SPZ.Timer.After(ms, cb)` — One-shot timer.
- `SPZ.Timer.Every(ms, cb)` — Repeating timer (respects `TimerMinInterval`).
- `SPZ.Timer.Countdown(seconds, tickCb, doneCb)` — Second-based countdown.

### Helpers
- **Math**: `Distance`, `Heading`, `GridPositions`, `FormatTime`.
- **Table**: `Contains`, `Keys`, `Filter`, `Map`, `DeepClone`, `Shuffle`.
- **String**: `Trim`, `Split`, `Pad`, `Truncate`, `Format`.

---

*SPiceZ-Core — Internal Documentation*
