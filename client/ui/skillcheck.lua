-- spz-lib: Skill Check — blocking, returns true (pass) or false (fail/cancel)

---@param difficulty string|table|table[]  'easy'|'medium'|'hard' or {areaSize,speedMultiplier} or array of those
---@param inputs? string[]  FiveM key codes e.g. {'e','q'}  (default: {'e'})
---@return boolean success
function lib.skillCheck(difficulty, inputs)
  local p = promise.new()

  local mappedInputs = {}
  for _, k in ipairs(inputs or { 'e' }) do
    -- Normalise 'e' → 'KeyE' so the JS handler can match e.code
    if #k == 1 then
      mappedInputs[#mappedInputs + 1] = 'Key' .. k:upper()
    else
      mappedInputs[#mappedInputs + 1] = k
    end
  end

  local data = {
    difficulty = difficulty,
    inputs     = mappedInputs,
  }

  SendNUIMessage({ action = 'spz:skillcheck:start', data = data })
  SetNuiFocus(false, false)

  RegisterNUICallback('spz:skillcheck:result', function(result, cb)
    cb('ok')
    p:resolve(result.success == true)
  end)

  return Citizen.Await(p)
end
