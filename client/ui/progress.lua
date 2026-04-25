-- spz-lib: Progress bar/circle export (blocking — suspends until done/cancelled)

---@param opts { duration: number, label?: string, type?: string, canCancel?: boolean, position?: string }
---@return boolean cancelled
function lib.progressBar(opts)
  local p = promise.new()

  SendNUIMessage({ action = 'spz:progress:show', data = opts })
  SetNuiFocus(false, false)

  RegisterNUICallback('spz:progress:done', function(data, cb)
    cb('ok')
    p:resolve(data.cancelled == true)
  end)

  return Citizen.Await(p)
end
