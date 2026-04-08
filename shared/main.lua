SPZ = {}

-- Initialize namespaces
SPZ.Callbacks = {}
SPZ.Notify = {}
SPZ.Timer = {}
SPZ.Logger = {}
SPZ.Math = {}
SPZ.Table = {}
SPZ.String = {}

-- Shared Constants
SPZ.License = { C = 0, B = 1, A = 2, S = 3 }
SPZ.LicenseNames = { [0] = "Class C — Street", [1] = "Class B — Sport", [2] = "Class A — Pro", [3] = "Class S — Elite" }
SPZ.State = { IDLE = "IDLE", FREEROAM = "FREEROAM", QUEUED = "QUEUED", RACING = "RACING", SPECTATING = "SPECTATING" }
SPZ.RaceState = { IDLE = "IDLE", POLLING = "POLLING", WAITING = "WAITING", COUNTDOWN = "COUNTDOWN", LIVE = "LIVE", ENDED = "ENDED", CLEANUP = "CLEANUP" }
SPZ.LogLevel = { DEBUG = 0, INFO = 1, WARN = 2, ERROR = 3 }

-- Version Export
function GetVersion()
    return "1.0.0"
end

exports("GetVersion", GetVersion)
