-- spz-lib: TextUI export

---@param text string
---@param opts? { position?: string, icon?: string, iconColor?: string, align?: string }
function lib.showTextUI(text, opts)
  local data = opts and table.clone(opts) or {}
  data.text  = text
  SendNUIMessage({ action = 'spz:textui:show', data = data })
  SetNuiFocus(false, false)
end

function lib.hideTextUI()
  SendNUIMessage({ action = 'spz:textui:hide', data = {} })
end

function lib.isTextUIOpen()
  return LocalPlayer.state.spzTextUIOpen or false
end
