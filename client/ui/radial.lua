-- spz-lib: Radial Menu

---@param opts { items: table[] }
function lib.showRadial(opts)
  SendNUIMessage({ action = 'spz:radial:show', data = opts })
  SetNuiFocus(true, true)
end

function lib.hideRadial()
  SendNUIMessage({ action = 'spz:radial:hide', data = {} })
  SetNuiFocus(false, false)
end

---@param opts { items: table[] }
function lib.updateRadial(opts)
  SendNUIMessage({ action = 'spz:radial:update', data = opts })
end

---@param id string  sub-menu id registered in JS via radial.registerSub
---@param items table[]
function lib.registerRadialSub(id, items)
  -- Propagate sub-menu registry to the NUI
  SendNUIMessage({ action = 'spz:radial:registerSub', data = { id = id, items = items } })
end

-- NUI callbacks
RegisterNUICallback('spz:radial:select', function(data, cb)
  cb('ok')
  SetNuiFocus(false, false)
  TriggerEvent('spz:radial:itemSelected', data.id)
end)

RegisterNUICallback('spz:radial:close', function(data, cb)
  cb('ok')
  SetNuiFocus(false, false)
end)
