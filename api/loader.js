export default function handler(req, res) {
  const script = `
-- SwiftBara Universal Loader
-- Tương thích: Synapse X, Fluxus, KRNL, Solara, Velocity, Xeno, v.v.

local function httpGet(url)
    local result = nil
    
    -- Cách 1: game:HttpGet (phổ biến nhất)
    pcall(function()
        result = game:HttpGet(url)
    end)
    if result then return result end
    
    -- Cách 2: game:HttpGetAsync
    pcall(function()
        result = game:HttpGetAsync(url)
    end)
    if result then return result end
    
    -- Cách 3: request() function
    pcall(function()
        result = request({Url = url, Method = "GET"}).Body
    end)
    if result then return result end
    
    -- Cách 4: http_request
    pcall(function()
        result = http_request({Url = url, Method = "GET"}).Body
    end)
    if result then return result end
    
    -- Cách 5: HttpService (backup)
    pcall(function()
        local HttpService = game:GetService("HttpService")
        result = HttpService:GetAsync(url)
    end)
    if result then return result end
    
    -- Cách 6: syn.request (Synapse X)
    pcall(function()
        result = syn.request({Url = url, Method = "GET"}).Body
    end)
    if result then return result end
    
    -- Cách 7: fluxus.request
    pcall(function()
        result = fluxus.request({Url = url, Method = "GET"}).Body
    end)
    if result then return result end
    
    return nil
end

-- Load script chính
local scriptUrl = "https://raw.githubusercontent.com/Scripybara/NameProtect/refs/heads/main/Swiftbara.lua"

local scriptContent = httpGet(scriptUrl)

if scriptContent then
    local func, err = loadstring(scriptContent)
    if func then
        func()
    else
        warn("[SwiftBara] Loadstring error: " .. tostring(err))
    end
else
    warn("[SwiftBara] Failed to fetch script!")
end
`;

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).send(script);
}
