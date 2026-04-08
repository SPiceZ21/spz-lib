-- config.lua (operator edits this)

Config = {}

-- ── Notify backend ─────────────────────────────────────────────────────────
-- "ox_lib"  → uses lib.notify from ox_lib (recommended)
-- "chat"    → falls back to GTA chat messages (no styling)
-- "nui"     → routes through spz-hud custom NUI
Config.NotifyBackend = "ox_lib"

-- Default notification duration (ms) if not specified by caller
Config.NotifyDefaultDuration = 3000

-- ── Callbacks ──────────────────────────────────────────────────────────────
-- How long a callback waits before firing nil and logging a WARN (ms)
Config.CallbackTimeout = 5000

-- ── Logging ────────────────────────────────────────────────────────────────
-- Minimum log level:  0=DEBUG  1=INFO  2=WARN  3=ERROR
-- Set to 1 (INFO) in production, 0 (DEBUG) during development
Config.LogLevel = 1

-- ── Math / Grid ────────────────────────────────────────────────────────────
-- Start grid spacing for GridPositions()
Config.GridRowSpacing = 8.0    -- distance between rows front-to-back (meters)
Config.GridColSpacing = 4.5    -- distance between columns side-to-side (meters)

-- ── Timer ──────────────────────────────────────────────────────────────────
-- Minimum interval for SPZ.Timer.Every (ms) — prevents accidentally hammering the server
Config.TimerMinInterval = 100
