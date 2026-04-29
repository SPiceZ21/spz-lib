-- spz-lib: Global Interaction Handler
-- Provides a radial menu for common race actions.

local function openRaceRadial()
    local items = {
        {
            id = 'car_spawn',
            label = 'Spawn Vehicle',
            icon = [[<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 13.1V16c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>]]
        },
        {
            id = 'join_race',
            label = 'Join Race',
            icon = [[<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>]]
        },
        {
            id = 'leave_race',
            label = 'Leave Race',
            icon = [[<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>]]
        },
        {
            id = 'leaderboard',
            label = 'Leaderboard',
            icon = [[<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>]]
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
