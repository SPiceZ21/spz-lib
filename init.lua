--[[
  spz-lib — init.lua
  Defines the `lib` global table exposed to all resources that depend on spz-lib.
  UI methods are loaded from client/ui/*.lua (client-only).
  Call lib.foo() exactly like ox_lib's lib.foo().
]]

lib = lib or {}

-- Version guard
lib.name    = 'spz-lib'
lib.version = '1.0.0'

-- ── Convenience: print with resource prefix ──────────────────────────────────
function lib.print(...)
  local parts = { '[spz-lib]' }
  for i = 1, select('#', ...) do
    parts[#parts + 1] = tostring(select(i, ...))
  end
  print(table.concat(parts, ' '))
end

-- ── table.clone (used internally in textui.lua) ──────────────────────────────
if not table.clone then
  function table.clone(t)
    local copy = {}
    for k, v in pairs(t) do copy[k] = v end
    return copy
  end
end
