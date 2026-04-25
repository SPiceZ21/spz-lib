-- spz-lib: Input Dialog — blocking, returns array of field values or nil (cancelled)

---@param opts { heading: string, rows: table[], allowCancel?: boolean, size?: string }
---@return table|nil values  nil if cancelled
function lib.inputDialog(opts)
  local p = promise.new()

  SendNUIMessage({ action = 'spz:dialog:show', data = opts })
  SetNuiFocus(true, true)

  RegisterNUICallback('spz:dialog:result', function(data, cb)
    cb('ok')
    SetNuiFocus(false, false)
    p:resolve(data.result)  -- nil when cancelled
  end)

  return Citizen.Await(p)
end
