-- spz-lib: Global Interaction Handler
-- Provides a radial menu for common race actions.

local function openRaceRadial()
    local items = {
        {
            id = 'car_spawn',
            label = 'Spawn Vehicle',
            icon = 'car'
        },
        {
            id = 'join_race',
            label = 'Join Race',
            icon = 'flag'
        },
        {
            id = 'leave_race',
            label = 'Leave Race',
            icon = 'log-out'
        },
        {
            id = 'leaderboard',
            label = 'Leaderboard',
            icon = 'trophy'
        }
    }

    lib.showRadial({
        items = items
    })
end

-- Handle item selection
AddEventHandler('spz:radial:itemSelected', function(id)
    print("[DEBUG] Radial item selected:", id)
    if id == 'car_spawn' then
        TriggerEvent('SPZ:carspawner:openMenu')
    elseif id == 'join_race' then
        TriggerServerEvent('SPZ:joinQueue')
    elseif id == 'leave_race' then
        TriggerServerEvent('SPZ:leaveQueue')
    elseif id == 'leaderboard' then
        Citizen.CreateThread(function()
            Citizen.Wait(500) -- Wait for radial focus to release
            TriggerServerEvent('SPZ:leaderboard:request')
        end)
    end
end)


-- Alternatively, register a command so players can bind it
RegisterCommand('radial', function()
    openRaceRadial()
end, false)

-- Better yet, use Key Mapping
RegisterKeyMapping('radial', 'Open Race Radial Menu', 'keyboard', 'Z')
