local Handlers = {}

---Registers a named callback that can be triggered from the other side.
---@param name string
---@param fn function
function SPZ.Callbacks.Register(name, fn)
    Handlers[name] = fn
end

---Alias for Register, used on client side.
---@param name string
---@param fn function
function SPZ.Callbacks.RegisterClient(name, fn)
    Handlers[name] = fn
end

-- Server-side Trigger Handler (Client -> Server)
if IsDuplicityVersion() then
    RegisterNetEvent("SPZ:callback:trigger", function(name, requestId, data)
        local src = source
        local handler = Handlers[name]

        if not handler then
            print(("^1[ERROR] [spz-lib] Received unregistered server callback: %s^7"):format(name))
            TriggerClientEvent("SPZ:callback:response", src, requestId, nil)
            return
        end

        local function cb(result)
            TriggerClientEvent("SPZ:callback:response", src, requestId, result)
        end

        handler(src, cb, data)
    end)

    -- Server-side Response Handler (Client -> Server Response for TriggerClient)
    RegisterNetEvent("SPZ:callback:clientResponse", function(requestId, result)
        local src = source
        -- This will be handled by the server-side PendingRequests in shared/callbacks if we implement TriggerClient here.
        -- But TriggerClient is usually server-only, so we might put that logic in a server-only block.
    end)
else
    -- Client-side Trigger Handler (Server -> Client)
    RegisterNetEvent("SPZ:callback:clientTrigger", function(name, requestId, data)
        local handler = Handlers[name]

        if not handler then
            print(("^1[ERROR] [spz-lib] Received unregistered client callback: %s^7"):format(name))
            TriggerServerEvent("SPZ:callback:clientResponse", requestId, nil)
            return
        end

        local function cb(result)
            TriggerServerEvent("SPZ:callback:clientResponse", requestId, result)
        end

        handler(cb, data)
    end)
end

-- Implementation for TriggerClient (Server -> Client)
if IsDuplicityVersion() then
    local PendingRequests = {}
    local RequestId = 0

    function SPZ.Callbacks.TriggerClient(name, source, data, cb)
        RequestId = RequestId + 1
        local id = RequestId

        PendingRequests[id] = cb

        TriggerClientEvent("SPZ:callback:clientTrigger", source, name, id, data)

        -- Timeout handling
        SetTimeout(Config.CallbackTimeout or 5000, function()
            if PendingRequests[id] then
                print(("^3[WARN] [spz-lib] Client callback timed out: %s (Player: %s)^7"):format(name, source))
                local callback = PendingRequests[id]
                PendingRequests[id] = nil
                callback(nil)
            end
        end)
    end

    RegisterNetEvent("SPZ:callback:clientResponse", function(requestId, result)
        local src = source
        local cb = PendingRequests[requestId]

        if cb then
            PendingRequests[requestId] = nil
            cb(result)
        end
    end)
end
