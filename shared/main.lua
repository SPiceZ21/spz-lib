SPZ = SPZ or {}

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

-- Reference Constants
SPZ.PointsTable = {
    [1]  = 25,
    [2]  = 18,
    [3]  = 15,
    [4]  = 12,
    [5]  = 10,
    [6]  = 8,
    [7]  = 6,
    [8]  = 4,
    [9]  = 2,
    [10] = 1,
}

SPZ.SRChange = {
    FINISH        =  0.10,
    TOP3          =  0.20,
    PERSONAL_BEST =  0.05,
    DNF           = -0.50,
    TIMEOUT       = -0.25,
}

-- Version Export
function GetVersion()
    return "1.0.0"
end

function IsReady()
    return true
end

exports("GetVersion", GetVersion)
exports("isReady", IsReady)
exports("GetCoreObject", function()
    -- Ensure Register always uses the export to cross resource boundaries
    if IsDuplicityVersion() then
        SPZ.Callbacks.Register = function(name, cb)
            exports["spz-lib"]:RegisterServerCallback(name, cb)
        end
    else
        SPZ.Callbacks.Register = function(name, cb)
            exports["spz-lib"]:RegisterClientCallback(name, cb)
        end
    end
    return SPZ
end)
