---Returns true if a value exists in a table.
---@param tbl table
---@param val any
---@return boolean
function SPZ.Table.Contains(tbl, val)
    if not tbl then return false end
    for _, v in pairs(tbl) do
        if v == val then return true end
    end
    return false
end

---Returns an array of all keys in a table.
---@param tbl table
---@return table
function SPZ.Table.Keys(tbl)
    local keys = {}
    if not tbl then return keys end
    for k, _ in pairs(tbl) do
        table.insert(keys, k)
    end
    return keys
end

---Returns a new table containing only elements where fn returns true.
---@param tbl table
---@param fn function
---@return table
function SPZ.Table.Filter(tbl, fn)
    local filtered = {}
    if not tbl then return filtered end
    for k, v in pairs(tbl) do
        if fn(v, k) then
            if type(k) == "number" then
                table.insert(filtered, v)
            else
                filtered[k] = v
            end
        end
    end
    return filtered
end

---Returns a new table with each element transformed by fn.
---@param tbl table
---@param fn function
---@return table
function SPZ.Table.Map(tbl, fn)
    local mapped = {}
    if not tbl then return mapped end
    for k, v in pairs(tbl) do
        mapped[k] = fn(v, k)
    end
    return mapped
end

---Returns the number of elements in a table (including hash keys).
---@param tbl table
---@return number
function SPZ.Table.Count(tbl)
    local count = 0
    if not tbl then return count end
    for _ in pairs(tbl) do
        count = count + 1
    end
    return count
end

---Shallow copy of a table.
---@param tbl table
---@return table
function SPZ.Table.Clone(tbl)
    local clone = {}
    if not tbl then return clone end
    for k, v in pairs(tbl) do
        clone[k] = v
    end
    return clone
end

---Recursive deep copy of a table.
---@param tbl table
---@return table
function SPZ.Table.DeepClone(tbl)
    if type(tbl) ~= "table" then return tbl end
    local clone = {}
    for k, v in pairs(tbl) do
        clone[k] = SPZ.Table.DeepClone(v)
    end
    return clone
end

---Merges two tables into a new table. Keys in b overwrite keys in a.
---@param a table
---@param b table
---@return table
function SPZ.Table.Merge(a, b)
    local merged = SPZ.Table.Clone(a or {})
    if not b then return merged end
    for k, v in pairs(b) do
        merged[k] = v
    end
    return merged
end

---Returns a new array with elements in random order.
---@param tbl table
---@return table
function SPZ.Table.Shuffle(tbl)
    local shuffled = SPZ.Table.Clone(tbl or {})
    local length = #shuffled
    for i = length, 2, -1 do
        local j = math.random(i)
        shuffled[i], shuffled[j] = shuffled[j], shuffled[i]
    end
    return shuffled
end

---Returns a subset of an array from index from to to.
---@param tbl table
---@param from number
---@param to number
---@return table
function SPZ.Table.Slice(tbl, from, to)
    local sliced = {}
    if not tbl then return sliced end
    for i = from or 1, to or #tbl do
        table.insert(sliced, tbl[i])
    end
    return sliced
end
