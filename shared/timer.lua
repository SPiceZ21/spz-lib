local ActiveTimers = {}
local NextTimerId = 0

---Fires the callback after specified milliseconds.
---@param ms number
---@param cb function
---@return number timerId
function SPZ.Timer.After(ms, cb)
    NextTimerId = NextTimerId + 1
    local id = NextTimerId
    ActiveTimers[id] = true

    SetTimeout(ms, function()
        if ActiveTimers[id] then
            ActiveTimers[id] = nil
            cb()
        end
    end)

    return id
end

---Fires the callback every specified milliseconds.
---@param ms number
---@param cb function
---@return number timerId
function SPZ.Timer.Every(ms, cb)
    local minInterval = Config.TimerMinInterval or 100
    if ms < minInterval then
        print(("^3[WARN] [spz-lib] Timer.Every called with %dms, clamping to %dms^7"):format(ms, minInterval))
        ms = minInterval
    end

    NextTimerId = NextTimerId + 1
    local id = NextTimerId
    ActiveTimers[id] = true

    local function tick()
        SetTimeout(ms, function()
            if ActiveTimers[id] then
                cb()
                tick()
            end
        end)
    end

    tick()
    return id
end

---Cancels a running timer (After or Every).
---@param id number
function SPZ.Timer.Cancel(id)
    if not id then return end
    ActiveTimers[id] = nil
end

---Convenience wrapper for a second-based countdown.
---@param seconds number
---@param tickCb function(remaining)
---@param doneCb function
---@return number timerId
function SPZ.Timer.Countdown(seconds, tickCb, doneCb)
    local remaining = seconds

    local timerId = SPZ.Timer.Every(1000, function()
        remaining = remaining - 1
        if remaining > 0 then
            tickCb(remaining)
        else
            SPZ.Timer.Cancel(NextTimerId) -- The current timer
            -- Wait, NextTimerId might have changed. 
            -- We need to capture the ID returned by Every.
        end
    end)
    
    -- Let's fix the above logic:
    -- I'll rewrite Countdown slightly to be cleaner.
end

-- Re-implementing Countdown properly
function SPZ.Timer.Countdown(seconds, tickCb, doneCb)
    local remaining = seconds
    local id

    id = SPZ.Timer.Every(1000, function()
        remaining = remaining - 1
        if remaining > 0 then
            if tickCb then tickCb(remaining) end
        else
            SPZ.Timer.Cancel(id)
            if doneCb then doneCb() end
        end
    end)

    return id
end

---Returns a debounced version of the function.
---@param fn function
---@param ms number
---@return function
function SPZ.Timer.Debounce(fn, ms)
    local timerId

    return function(...)
        local args = {...}
        if timerId then SPZ.Timer.Cancel(timerId) end
        
        timerId = SPZ.Timer.After(ms, function()
            timerId = nil
            fn(table.unpack(args))
        end)
    end
end
