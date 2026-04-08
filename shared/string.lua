---Removes leading and trailing whitespace from a string.
---@param str string
---@return string
function SPZ.String.Trim(str)
    if not str then return "" end
    return str:match("^%s*(.-)%s*$")
end

---Splits a string by a delimiter.
---@param str string
---@param delimiter string
---@return table
function SPZ.String.Split(str, delimiter)
    local result = {}
    if not str or not delimiter then return result end
    
    local pattern = string.format("([^%s]+)", delimiter)
    for part in str:gmatch(pattern) do
        table.insert(result, part)
    end
    return result
end

---Returns true if string starts with the specified prefix.
---@param str string
---@param prefix string
---@return boolean
function SPZ.String.StartsWith(str, prefix)
    if not str or not prefix then return false end
    return str:sub(1, #prefix) == prefix
end

---Returns true if string ends with the specified suffix.
---@param str string
---@param suffix string
---@return boolean
function SPZ.String.EndsWith(str, suffix)
    if not str or not suffix then return false end
    return str:sub(-#suffix) == suffix
end

---Pads a string to a fixed length.
---@param str string
---@param len number
---@param char string? Defaults to " "
---@param rightAlign boolean?
---@return string
function SPZ.String.Pad(str, len, char, rightAlign)
    str = tostring(str)
    char = char or " "
    local padding = len - #str
    if padding <= 0 then return str end

    local padStr = string.rep(char, padding)
    return rightAlign and (padStr .. str) or (str .. padStr)
end

---Truncate a string and appends ellipsis if exceeded.
---@param str string
---@param maxLen number
---@return string
function SPZ.String.Truncate(str, maxLen)
    if not str then return "" end
    if #str <= maxLen then return str end
    return str:sub(1, maxLen) .. "…"
end

---Lightweight template formatter. Replaces {key} placeholders.
---@param template string
---@param values table
---@return string
function SPZ.String.Format(template, values)
    if not template or not values then return template or "" end
    return (template:gsub("{(.-)}", function(key)
        local val = values[key]
        return val ~= nil and tostring(val) or "{" .. key .. "}"
    end))
end
