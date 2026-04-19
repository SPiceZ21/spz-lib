---Calculates 3D distance between two vectors.
---@param v1 vector3
---@param v2 vector3
---@return number
function SPZ.Math.Distance(v1, v2)
    return #(v1 - v2)
end

---Calculates 2D distance between two vectors (ignores Z).
---@param v1 vector3
---@param v2 vector3
---@return number
function SPZ.Math.Distance2D(v1, v2)
    return #(v1.xy - v2.xy)
end

---Linear interpolation between two numbers.
---@param a number
---@param b number
---@param t number
---@return number
function SPZ.Math.Lerp(a, b, t)
    return a + (b - a) * t
end

---Calculates the heading (0-360) from one point to another.
---@param from vector3
---@param to vector3
---@return number
function SPZ.Math.Heading(from, to)
    local dx = to.x - from.x
    local dy = to.y - from.y
    local heading = math.deg(math.atan2(-dx, dy))
    return (heading < 0) and (heading + 360) or heading
end

---Calculates staggered start grid positions.
---@param origin vector3
---@param heading number
---@param count number
---@param rowSpacing number|nil
---@param colSpacing number|nil
---@return table
function SPZ.Math.GridPositions(origin, heading, count, rowSpacing, colSpacing)
    local grid = {}
    local rowSpacing = rowSpacing or (Config and Config.GridRowSpacing) or 10.0
    local colSpacing = colSpacing or (Config and Config.GridColSpacing) or 5.0

    local rad = math.rad(heading)
    local forward = vec3(-math.sin(rad), math.cos(rad), 0.0)
    local right = vec3(math.cos(rad), math.sin(rad), 0.0)

    for i = 1, count do
        local row = math.floor((i - 1) / 2)
        local col = (i - 1) % 2 -- 0 = Left, 1 = Right

        -- Stagger: offset from center column
        local colOffset = (col == 0) and -colSpacing / 2 or colSpacing / 2
        
        -- Start first row slightly behind origin to avoid being "inside" the line
        local rowOffset = -(row * rowSpacing)

        local pos = origin + (forward * rowOffset) + (right * colOffset)
        
        table.insert(grid, {
            coords = pos,
            heading = heading
        })
    end

    return grid
end

---Formats milliseconds into "m:ss.ms" string.
---@param ms number
---@return string
function SPZ.Math.FormatTime(ms)
    if not ms or ms < 0 then return "0:00.000" end
    
    local minutes = math.floor(ms / 60000)
    local seconds = math.floor((ms % 60000) / 1000)
    local milliseconds = math.floor(ms % 1000)

    return string.format("%d:%02d.%03d", minutes, seconds, milliseconds)
end

---Formats the delta between two times as "+0.000" or "-0.000".
---@param ms1 number
---@param ms2 number
---@return string
function SPZ.Math.FormatTimeDelta(ms1, ms2)
    local delta = ms1 - ms2
    local sign = (delta >= 0) and "+" or "-"
    local absDelta = math.abs(delta)
    
    local seconds = math.floor(absDelta / 1000)
    local milliseconds = math.floor(absDelta % 1000)

    return string.format("%s%d.%03d", sign, seconds, milliseconds)
end

---Clamps a value between min and max.
---@param val number
---@param min number
---@param max number
---@return number
function SPZ.Math.Clamp(val, min, max)
    if val < min then return min end
    if val > max then return max end
    return val
end

---Rounds a number to N decimal places.
---@param val number
---@param decimals number
---@return number
function SPZ.Math.Round(val, decimals)
    local power = 10 ^ decimals
    return math.floor(val * power + 0.5) / power
end
