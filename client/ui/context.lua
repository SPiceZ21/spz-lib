-- spz-lib: Context Menu

---@param opts { id: string, title: string, position?: string, canClose?: boolean, options: table[] }
function lib.registerContext(opts)
  if not lib._contextRegistry then lib._contextRegistry = {} end
  lib._contextRegistry[opts.id] = opts
end

---@param id string
function lib.showContext(id)
  local data = (lib._contextRegistry and lib._contextRegistry[id]) or { id = id }
  SendNUIMessage({ action = 'spz:context:show', data = data })
  SetNuiFocus(true, true)
  lib._activeContextId = id
end

---@param opts { id: string, title: string, position?: string, canClose?: boolean, options: table[] }
function lib.showContextDirect(opts)
  lib.registerContext(opts)
  lib.showContext(opts.id)
end

function lib.hideContext()
  SendNUIMessage({ action = 'spz:context:hide', data = {} })
  SetNuiFocus(false, false)
  lib._activeContextId = nil
end

function lib.getOpenContextMenu()
  return lib._activeContextId
end

-- NUI callbacks
RegisterNUICallback('spz:context:select', function(data, cb)
  cb('ok')
  SetNuiFocus(false, false)
  lib._activeContextId = nil

  local ctx = lib._contextRegistry and lib._contextRegistry[data.id]
  if not ctx then return end
  local item = ctx.options and ctx.options[data.index + 1]
  if not item then return end

  -- Fire event if specified
  if item.event       then TriggerEvent(item.event, item.args or data.args) end
  if item.serverEvent then TriggerServerEvent(item.serverEvent, item.args or data.args) end
end)

RegisterNUICallback('spz:context:close', function(data, cb)
  cb('ok')
  SetNuiFocus(false, false)
  lib._activeContextId = nil
end)
