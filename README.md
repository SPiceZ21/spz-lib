<div align="center">

<img src="https://github.com/SPiceZ21/spz-core-media-kit/raw/main/Banner/Banner%232.png" alt="SPiceZ-Core Banner" width="100%"/>

<br/>

# spz-lib

### Shared Utility Library

*The foundational utility layer for the entire `spz-*` ecosystem. Load this first — everything else depends on it.*

<br/>

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-orange.svg?style=flat-square)](https://www.gnu.org/licenses/gpl-3.0)
[![FiveM](https://img.shields.io/badge/FiveM-Compatible-orange?style=flat-square)](https://fivem.net)
[![Lua](https://img.shields.io/badge/Lua-5.4-blue?style=flat-square&logo=lua)](https://lua.org)
[![Status](https://img.shields.io/badge/Status-In%20Development-green?style=flat-square)]()

</div>

---

## Overview

`spz-lib` is the shared foundation all other SPiceZ modules build on top of. It exposes a unified `SPZ` global table covering callbacks, notifications, timers, logging, math utilities, and table helpers.

No `spz-*` module imports from another module's files directly — all shared utilities come from `spz-lib` only. This keeps the module boundary clean and makes the entire framework testable in isolation.

> **Must be the first `spz-*` resource loaded in your `server.cfg`.**

---

## Features

- **Promise-based Callbacks** — Clean client ↔ server request-response with configurable timeouts and automatic error propagation
- **Unified Notifications** — Single API with swappable backends: `ox_lib`, `chat`, or the custom `spz-hud` NUI toast system
- **Advanced Timers** — Cancellable one-shot, repeating, countdown, and debounce helpers used across `spz-races` for polls, countdowns, and intermissions
- **Structured Logging** — Per-module bound loggers with automatic JSON serialization and runtime log-level toggling via `/spz debug`
- **Math & Vector Utilities** — 3D/2D distance, heading calculations, staggered race grid positioning, and lap time formatting
- **Functional Table Helpers** — Extended `Map`, `Filter`, `DeepClone`, `Shuffle`, and `Count` covering hash-key tables too
- **String Utilities** — `Trim`, `Split`, `Pad`, `Truncate`, and `Format` for consistent output across all modules

---

## Dependencies

| Resource | Version | Role |
|---|---|---|
| `oxmysql` | 2.0.0+ | Required by dependent modules |
| `ox_lib` | Latest | Default notification backend |

---

## Installation

```cfg
ensure oxmysql
ensure ox_lib

ensure spz-lib       # must come before all other spz-* resources
ensure spz-core
# ... other spz-* modules
```

---

## Configuration

Edit `config.lua` to adjust library-wide behavior:

| Key | Default | Description |
|---|---|---|
| `NotifyBackend` | `"ox_lib"` | `"ox_lib"` / `"chat"` / `"nui"` |
| `LogLevel` | `1` | `0`=DEBUG `1`=INFO `2`=WARN `3`=ERROR |
| `CallbackTimeout` | `5000` | Global callback timeout in ms |
| `GridRowSpacing` | `8.0` | Race start grid row spacing (metres) |
| `GridColSpacing` | `4.5` | Race start grid column spacing (metres) |
| `TimerMinInterval` | `50` | Minimum interval for `SPZ.Timer.Every` |

---

## API Reference

All utilities are exposed through the global `SPZ` table, available on both client and server.

### Callbacks

```lua
-- Server: register a named callback
SPZ.Callbacks.Register("spz-identity:getProfile", function(source, cb, data)
  local profile = exports["spz-identity"]:GetProfile(source)
  cb(profile)
end)

-- Client: trigger it (standard)
SPZ.Callbacks.Trigger("spz-identity:getProfile", {}, function(profile)
  print(profile.name)
end)

-- Client: trigger it (awaitable in coroutine)
local profile = SPZ.Callbacks.TriggerAwait("spz-identity:getProfile", {})
```

### Notify

```lua
-- Client-side (local only)
SPZ.Notify("Race starting in 30s", "info", 3000)

-- Server-side (send to one player)
SPZ.Notify(source, "License B unlocked!", "success", 5000)

-- Server-side (broadcast to all)
SPZ.NotifyAll("Season reset complete.", "warning", 6000)
```

Types: `info` · `success` · `warning` · `error`

### Timers

```lua
-- One-shot after delay
local id = SPZ.Timer.After(30000, function()
  -- poll closed
end)

-- Repeating interval
local tick = SPZ.Timer.Every(1000, function()
  -- broadcast position update
end)

-- Second-based countdown with tick and done callbacks
SPZ.Timer.Countdown(3, function(remaining)
  TriggerClientEvent("SPZ:countdown", -1, remaining)
end, function()
  TriggerClientEvent("SPZ:go", -1)
end)

-- Cancel any timer
SPZ.Timer.Cancel(id)
```

### Math & Vectors

```lua
SPZ.Math.Distance(v1, v2)                        -- 3D euclidean distance
SPZ.Math.Lerp(a, b, t)                           -- linear interpolation
SPZ.Math.Heading(from, to)                       -- GTA V heading angle (degrees)
SPZ.Math.GridPositions(origin, heading, count)   -- staggered start grid coords
SPZ.Math.FormatTime(ms)                          -- 65432 → "1:05.432"
```

### Table Helpers

```lua
SPZ.Table.Contains(tbl, val)     -- bool
SPZ.Table.Keys(tbl)              -- array of keys (hash-key safe)
SPZ.Table.Filter(tbl, fn)        -- filtered table
SPZ.Table.Map(tbl, fn)           -- mapped table
SPZ.Table.Count(tbl)             -- length including hash keys
SPZ.Table.DeepClone(tbl)         -- deep copy
SPZ.Table.Shuffle(tbl)           -- in-place Fisher-Yates shuffle
```

### String Helpers

```lua
SPZ.String.Trim(s)               -- strip leading/trailing whitespace
SPZ.String.Split(s, sep)         -- split into array
SPZ.String.Pad(s, len, char)     -- left-pad to length
SPZ.String.Truncate(s, max)      -- truncate with "..."
SPZ.String.Format(template, ...) -- string.format wrapper
```

### Logging

```lua
-- Each module creates its own bound logger
local Log = SPZ.Logger("spz-races")

Log.info("Race started", raceId)
Log.warn("Player DNF", source)
Log.error("Bucket creation failed", err)
Log.debug("Checkpoint hit", source, index)   -- only shown when debug mode on
```

Toggle debug output at runtime with `/spz debug`.

---

<div align="center">

*Part of the [SPiceZ-Core](https://github.com/SPiceZ-Core) ecosystem*

**[Docs](https://github.com/SPiceZ-Core/spz-docs) · [Discord](https://discord.gg/) · [Issues](https://github.com/SPiceZ-Core/spz-lib/issues)**

</div>
