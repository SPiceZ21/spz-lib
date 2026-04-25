-- spz-lib: Alert (confirm/cancel modal) — blocking

---@param opts { header: string, content: string, centered?: boolean, cancel?: boolean, size?: string, labels?: { confirm?: string, cancel?: string } }
---@return 'confirm'|'cancel' result
function lib.alertDialog(opts)
  local p = promise.new()

  SendNUIMessage({ action = 'spz:alert:show', data = opts })
  SetNuiFocus(true, true)

  RegisterNUICallback('spz:alert:result', function(data, cb)
    cb('ok')
    SetNuiFocus(false, false)
    p:resolve(data.result)
  end)

  return Citizen.Await(p)
end
