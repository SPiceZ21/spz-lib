local function showClientNotify(message, type, duration)
    local backend = Config.NotifyBackend or "ox_lib"
    type = type or "info"
    duration = duration or Config.NotifyDefaultDuration or 3000

    if backend == "ox_lib" then
        if lib and lib.notify then
            lib.notify({
                title = "NOTIFICATION",
                description = message,
                type = type,
                duration = duration
            })
        else
            backend = "chat" -- Fallback
        end
    end

    if backend == "chat" then
        local color = {255, 255, 255}
        if type == "success" then color = {0, 255, 0}
        elseif type == "warning" then color = {255, 255, 0}
        elseif type == "error" then color = {255, 0, 0}
        end

        TriggerEvent("chat:addMessage", {
            color = color,
            multiline = true,
            args = {"SPZ-LIB", message}
        })
    end

    if backend == "nui" then
        SendNUIMessage({
            action = "notify",
            data = {
                message = message,
                type = type,
                duration = duration
            }
        })
    end
end

if IsDuplicityVersion() then
    ---Sends a notification to a specific player.
    ---@param source number Player server ID
    ---@param message string Notification text
    ---@param type string? "info" | "success" | "warning" | "error"
    ---@param duration number? Milliseconds
    function SPZ.Notify(source, message, type, duration)
        if type(source) ~= "number" then
            print("^1[ERROR] [spz-lib] SPZ.Notify on server requires player source as first argument.^7")
            return
        end
        TriggerClientEvent("SPZ:notify:trigger", source, message, type, duration)
    end

    ---Broadcasts a notification to all connected players.
    ---@param message string
    ---@param type string?
    ---@param duration number?
    function SPZ.NotifyAll(message, type, duration)
        TriggerClientEvent("SPZ:notify:trigger", -1, message, type, duration)
    end
else
    ---Shows a notification to the local player.
    ---@param message string Notification text
    ---@param type string? "info" | "success" | "warning" | "error"
    ---@param duration number? Milliseconds
    function SPZ.Notify(message, type, duration)
        showClientNotify(message, type, duration)
    end

    -- Client listener for server-triggered notifications
    RegisterNetEvent("SPZ:notify:trigger", function(message, type, duration)
        showClientNotify(message, type, duration)
    end)
end
