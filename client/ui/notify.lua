-- spz-lib: Notification UI export

---@param opts { title?: string, description?: string, type?: string, duration?: number, position?: string, id?: string, icon?: string, iconColor?: string }
function lib.notify(opts)
  SendNUIMessage({ action = 'spz:notify', data = opts })
end
