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

local s = http("https://raw.githubusercontent.com/Scripybara/NameProtect/refs/heads/main/Swiftbara.lua")
if s then loadstring(s)() else warn("Load failed!") end
`;

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).send(script);
}
