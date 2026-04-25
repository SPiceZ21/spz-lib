-- spz-lib: Keyboard Menu

---@param opts { id: string, title: string, position?: string, options: table[] }
function lib.registerMenu(opts, cb)
  -- Store callback against menu id for later
  if not lib._menuCallbacks then lib._menuCallbacks = {} end
  lib._menuCallbacks[opts.id] = cb
end

---@param id string  menu id passed to registerMenu
function lib.showMenu(id)
  if not lib._menuCallbacks or not lib._menuCallbacks[id] then
    return warn('[spz-lib] lib.showMenu: no menu registered with id ' .. tostring(id))
  end
  -- The registered opts were stored separately — this pattern mirrors ox_lib
  SendNUIMessage({ action = 'spz:menu:show', data = lib._menuOpts and lib._menuOpts[id] })
  SetNuiFocus(false, false)
end

---@param opts { id: string, title: string, position?: string, options: table[] }
---@param cb fun(selected: table, scrollIndex: number, args: any)
function lib.showMenuDirect(opts, cb)
  if not lib._menuCallbacks then lib._menuCallbacks = {} end
  if not lib._menuOpts      then lib._menuOpts = {} end
  lib._menuCallbacks[opts.id] = cb
  lib._menuOpts[opts.id]      = opts
  SendNUIMessage({ action = 'spz:menu:show', data = opts })
  SetNuiFocus(false, false)
end

function lib.hideMenu()
  SendNUIMessage({ action = 'spz:menu:hide', data = {} })
end

-- NUI callbacks
RegisterNUICallback('spz:menu:select', function(data, cb)
  cb('ok')
  local id = lib._currentMenuId
  if id and lib._menuCallbacks and lib._menuCallbacks[id] then
    local opts = lib._menuOpts and lib._menuOpts[id]
    local item = opts and opts.options and opts.options[data.index + 1]
    lib._menuCallbacks[id](item, data.scrollIndex, data.args)
  end
end)

RegisterNUICallback('spz:menu:check', function(data, cb)
  cb('ok')
  -- fires on checkbox toggle — handled by caller via select callback if needed
end)

RegisterNUICallback('spz:menu:scroll', function(data, cb)
  cb('ok')
end)

RegisterNUICallback('spz:menu:close', function(data, cb)
  cb('ok')
end)
