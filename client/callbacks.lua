local PendingRequests = {}
local RequestId = 0

---Triggers a server callback asynchronously.
---@param name string
---@param data any
---@param cb function
function SPZ.Callbacks.Trigger(name, data, cb)
    RequestId = RequestId + 1
    local id = RequestId

    PendingRequests[id] = cb

    TriggerServerEvent("SPZ:callback:trigger", name, id, data)

    -- Timeout logic
    SetTimeout(Config.CallbackTimeout or 5000, function()
        if PendingRequests[id] then
            print(("^3[WARN] [spz-lib] Server callback timed out: %s^7"):format(name))
            local callback = PendingRequests[id]
            PendingRequests[id] = nil
            callback(nil)
        end
    end)
end

---Triggers a server callback and awaits the result.
---Must be called within a thread/coroutine.
---@param name string
---@param data any
---@return any result
function SPZ.Callbacks.TriggerAwait(name, data)
    local p = promise.new()

    SPZ.Callbacks.Trigger(name, data, function(result)
        p:resolve(result)
    end)

    return Citizen.Await(p)
end

-- Client-side Response Handler (Server -> Client Response for Trigger)
RegisterNetEvent("SPZ:callback:response", function(requestId, result)
    local cb = PendingRequests[requestId]

    if cb then
        PendingRequests[requestId] = nil
        cb(result)
    end
end)
