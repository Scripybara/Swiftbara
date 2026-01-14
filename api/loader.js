local http = function(u)
    local r
    pcall(function() r = game:HttpGet(u) end)
    if r then return r end
    pcall(function() r = request({Url=u}).Body end)
    if r then return r end
    pcall(function() r = game:HttpGetAsync(u) end)
    return r
end

local allowedPlaceIds = {
    [301549746] = true,
    [1480424328] = true,
    [1869597719] = true
}

local function loadNameProtect()
    local nameprotect = http("https://raw.githubusercontent.com/Scripybara/NameProtect/refs/heads/main/Swiftbara.lua")
    if nameprotect then
        loadstring(nameprotect)()
    else
        warn("Load NameProtect failed!")
    end
end

local function loadCounterBlox()
    local counterblox = http("https://raw.githubusercontent.com/Scripybara/CounterBlox/refs/heads/main/Swiftbara.lua")
    if counterblox then
        loadstring(counterblox)()
    else
        warn("Load Counter Blox failed!")
    end
end

if allowedPlaceIds[game.PlaceId] then
    local ScreenGui = Instance.new("ScreenGui")
    ScreenGui.Name = "NPConfirm"
    ScreenGui.Parent = game:GetService("CoreGui")

    local Frame = Instance.new("Frame")
    Frame.Size = UDim2.new(0, 350, 0, 180)
    Frame.Position = UDim2.new(0.5, -175, 0.5, -90)
    Frame.BackgroundColor3 = Color3.fromRGB(30, 30, 40)
    Frame.BorderSizePixel = 0
    Frame.AnchorPoint = Vector2.new(0.5, 0.5)
    Frame.Parent = ScreenGui

    local UICorner = Instance.new("UICorner", Frame)
    UICorner.CornerRadius = UDim.new(0, 16)

    local Title = Instance.new("TextLabel")
    Title.Text = "Counter Blox Detected"
    Title.Font = Enum.Font.GothamBold
    Title.TextSize = 22
    Title.TextColor3 = Color3.fromRGB(255,255,255)
    Title.BackgroundTransparency = 1
    Title.Size = UDim2.new(1, 0, 0, 40)
    Title.Position = UDim2.new(0, 0, 0, 10)
    Title.Parent = Frame

    local Desc = Instance.new("TextLabel")
    Desc.Text = "Do You Want Load NameProtect?"
    Desc.Font = Enum.Font.Gotham
    Desc.TextSize = 18
    Desc.TextColor3 = Color3.fromRGB(200,200,200)
    Desc.BackgroundTransparency = 1
    Desc.Size = UDim2.new(1, -40, 0, 60)
    Desc.Position = UDim2.new(0, 20, 0, 50)
    Desc.TextWrapped = true
    Desc.Parent = Frame

    local Yes = Instance.new("TextButton")
    Yes.Text = "Yes
    Yes.Font = Enum.Font.GothamBold
    Yes.TextSize = 20
    Yes.TextColor3 = Color3.fromRGB(255,255,255)
    Yes.BackgroundColor3 = Color3.fromRGB(60,180,90)
    Yes.Size = UDim2.new(0, 120, 0, 36)
    Yes.Position = UDim2.new(0.5, -130, 1, -56)
    Yes.Parent = Frame
    Instance.new("UICorner", Yes).CornerRadius = UDim.new(0, 10)

    local No = Instance.new("TextButton")
    No.Text = "Nah"
    No.Font = Enum.Font.GothamBold
    No.TextSize = 20
    No.TextColor3 = Color3.fromRGB(255,255,255)
    No.BackgroundColor3 = Color3.fromRGB(200,60,60)
    No.Size = UDim2.new(0, 120, 0, 36)
    No.Position = UDim2.new(0.5, 10, 1, -56)
    No.Parent = Frame
    Instance.new("UICorner", No).CornerRadius = UDim.new(0, 10)

    loadCounterBlox()

    Yes.MouseButton1Click:Connect(function()
        loadNameProtect()
        ScreenGui:Destroy()
    end)
    No.MouseButton1Click:Connect(function()
        ScreenGui:Destroy()
    end)
else
    loadNameProtect()
end
