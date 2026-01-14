export default function handler(req, res) {
  const script = `
local http = function(u)
    local r
    pcall(function() r = game:HttpGet(u) end)
    if r then return r end
    pcall(function() r = request({Url=u}).Body end)
    if r then return r end
    pcall(function() r = game:HttpGetAsync(u) end)
    return r
end

-- Luôn load NameProtect trên mọi game
local nameprotect = http("https://raw.githubusercontent.com/Scripybara/NameProtect/refs/heads/main/Swiftbara.lua")
if nameprotect then
    loadstring(nameprotect)()
else
    warn("Load NameProtect failed!")
end

-- Chỉ load Counter Blox trên các PlaceId nhất định
local allowedPlaceIds = {
    [301549746] = true,
    [1480424328] = true,
    [1869597719] = true
}

if allowedPlaceIds[game.PlaceId] then
    local counterblox = http("https://raw.githubusercontent.com/Scripybara/CounterBlox/refs/heads/main/Swiftbara.lua")
    if counterblox then
        loadstring(counterblox)()
    else
        warn("Load Counter Blox failed!")
    end
end
`;

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).send(script);
}


