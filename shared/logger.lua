local ModuleLogLevels = {}

local function formatArg(v)
    if v == nil then return "nil" end
    if type(v) == "table" then return json.encode(v) end
    return tostring(v)
end

local function doLog(levelConst, levelName, moduleName, message, ...)
    local minLevel = ModuleLogLevels[moduleName] or Config.MinLogLevel or 1
    if levelConst < minLevel then return end

    local args = {...}
    local str = ("[^5%s^7] [^3%s^7] %s"):format(levelName, moduleName, message)

    for i = 1, #args do
        str = str .. "  " .. formatArg(args[i])
    end

    print(str)
end

---Creates a bound logger for a specific module.
---@param moduleName string
---@return table
function SPZ.Logger(moduleName)
    local logger = {}

    function logger.debug(msg, ...) doLog(0, "DEBUG", moduleName, msg, ...) end
    function logger.info(msg, ...)  doLog(1, "INFO ", moduleName, msg, ...) end
    function logger.warn(msg, ...)  doLog(2, "WARN ", moduleName, msg, ...) end
    function logger.error(msg, ...) doLog(3, "ERROR", moduleName, msg, ...) end

    return logger
end

---Changes the log level for a specific module or globally at runtime.
---@param module string Module name or "global"
---@param level number 0=DEBUG, 1=INFO, 2=WARN, 3=ERROR
function SPZ.SetLogLevel(module, level)
    if module == "global" then
        Config.MinLogLevel = level
    else
        ModuleLogLevels[module] = level
    end
end

exports("SetLogLevel", SPZ.SetLogLevel)
