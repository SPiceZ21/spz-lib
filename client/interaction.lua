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
    if id == 'car_spawn' then
        TriggerEvent('SPZ:carspawner:openMenu')
    elseif id == 'join_race' then
        TriggerServerEvent('SPZ:joinQueue')
    elseif id == 'leave_race' then
        TriggerServerEvent('SPZ:leaveQueue')
    elseif id == 'leaderboard' then
        TriggerServerEvent('SPZ:leaderboard:request')
    end
end)

-- Key listener for Radial Menu
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(0)
        -- Default to 'Z' key (20 / 48 depending on layout, but 20 is Z in most GTA mappings)
        -- We'll use RegisterKeyMapping for better user control if possible
        if IsControlJustReleased(0, 20) then -- Z
            if not IsPauseMenuActive() then
                openRaceRadial()
            end
        end
    end
end)

-- Alternatively, register a command so players can bind it
RegisterCommand('radial', function()
    openRaceRadial()
end, false)

-- Better yet, use Key Mapping
RegisterKeyMapping('radial', 'Open Race Radial Menu', 'keyboard', 'Z')
