export default function handler(req, res) {
  const script = `
--[[
    ╔═══════════════════════════════════════════════════════════════╗
    ║                    SwiftbaraProtect v6.0                      ║
    ║              ULTRA FAST + LEADERBOARD FIX EDITION             ║
    ╚═══════════════════════════════════════════════════════════════╝
]]

-- Services
local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local CoreGui = game:GetService("CoreGui")
local UserInputService = game:GetService("UserInputService")

-- Variables
local LocalPlayer = Players.LocalPlayer
local MyOriginalName = LocalPlayer.Name
local MyOriginalDisplayName = LocalPlayer.DisplayName

-- Config
local Config = {
    Enabled = true,
    MySpoofName = "SwiftbaraProtect",
    OthersSpoofName = "SwiftbaraProtect",
}

local Connections = {}
local MonitoredObjects = {}



--================================--
--     FAST TEXT REPLACEMENT     --
--================================--

local function ReplaceNamesInText(text)
    if type(text) ~= "string" or text == "" then return text end
    
    local newText = text
    
    -- Replace LocalPlayer
    newText = newText:gsub(MyOriginalName, Config.MySpoofName)
    if MyOriginalDisplayName ~= "" and MyOriginalDisplayName ~= MyOriginalName then
        newText = newText:gsub(MyOriginalDisplayName, Config.MySpoofName)
    end
    
    -- Replace other players
    for _, player in pairs(Players:GetPlayers()) do
        if player ~= LocalPlayer then
            newText = newText:gsub(player.Name, Config.OthersSpoofName)
            if player.DisplayName ~= "" and player.DisplayName ~= player.Name then
                newText = newText:gsub(player.DisplayName, Config.OthersSpoofName)
            end
        end
    end
    
    return newText
end

--================================--
--     CONTINUOUS MONITOR        --
--================================--

local function MonitorTextObject(obj)
    if not obj then return end
    if MonitoredObjects[obj] then return end
    
    pcall(function()
        if obj:IsA("TextLabel") or obj:IsA("TextButton") or obj:IsA("TextBox") then
            MonitoredObjects[obj] = true
            
            -- Monitor Text property changes
            local textConn = obj:GetPropertyChangedSignal("Text"):Connect(function()
                if not Config.Enabled then return end
                
                pcall(function()
                    local currentText = obj.Text
                    if currentText and currentText ~= "" then
                        local newText = ReplaceNamesInText(currentText)
                        if newText ~= currentText then
                            obj.Text = newText
                        end
                    end
                end)
            end)
            table.insert(Connections, textConn)
            
            -- Initial replacement
            if Config.Enabled then
                local currentText = obj.Text
                if currentText and currentText ~= "" then
                    local newText = ReplaceNamesInText(currentText)
                    if newText ~= currentText then
                        obj.Text = newText
                    end
                end
            end
        end
    end)
end

--================================--
--     LEADERBOARD FIX           --
--================================--

local function ProtectLeaderboard()
    pcall(function()
        local playerList = CoreGui:FindFirstChild("PlayerList")
        if playerList then
            -- Monitor all descendants
            for _, descendant in pairs(playerList:GetDescendants()) do
                MonitorTextObject(descendant)
            end
            
            -- Watch for new elements
            local conn = playerList.DescendantAdded:Connect(function(descendant)
                task.wait()
                if Config.Enabled then
                    MonitorTextObject(descendant)
                end
            end)
            table.insert(Connections, conn)
        end
    end)
end

--================================--
--     CHAT FIX                  --
--================================--

local function ProtectChat()
    pcall(function()
        local chat = CoreGui:FindFirstChild("ExperienceChat") or CoreGui:FindFirstChild("Chat")
        if chat then
            -- Monitor all descendants
            for _, descendant in pairs(chat:GetDescendants()) do
                MonitorTextObject(descendant)
            end
            
            -- Watch for new elements
            local conn = chat.DescendantAdded:Connect(function(descendant)
                task.wait()
                if Config.Enabled then
                    MonitorTextObject(descendant)
                end
            end)
            table.insert(Connections, conn)
        end
    end)
end

--================================--
--     HIDE HUMANOID NAMES       --
--================================--

local function HideHumanoidName(humanoid)
    if not humanoid then return end
    pcall(function()
        humanoid.DisplayDistanceType = Enum.HumanoidDisplayDistanceType.None
    end)
end

local function HideAllNameTags()
    for _, player in pairs(Players:GetPlayers()) do
        local character = player.Character
        if character then
            local humanoid = character:FindFirstChildOfClass("Humanoid")
            if humanoid then
                HideHumanoidName(humanoid)
            end
            
            local head = character:FindFirstChild("Head")
            if head then
                for _, child in pairs(head:GetChildren()) do
                    if child:IsA("BillboardGui") then
                        child.Enabled = false
                    end
                end
            end
        end
    end
end

--================================--
--     FAST CONTINUOUS SCAN      --
--================================--

local function ScanAndProtect()
    if not Config.Enabled then return end
    
    -- Hide name tags
    HideAllNameTags()
    
    -- Protect CoreGui
    pcall(function()
        for _, descendant in pairs(CoreGui:GetDescendants()) do
            MonitorTextObject(descendant)
        end
    end)
    
    -- Protect PlayerGui
    pcall(function()
        local playerGui = LocalPlayer:FindFirstChild("PlayerGui")
        if playerGui then
            for _, descendant in pairs(playerGui:GetDescendants()) do
                MonitorTextObject(descendant)
            end
        end
    end)
end

--================================--
--     MAIN PROTECTION SYSTEM    --
--================================--

local function StartProtection()
    -- Initial scan
    ScanAndProtect()
    ProtectLeaderboard()
    ProtectChat()
    
    -- Continuous update loop (FAST)
    local mainLoop = RunService.Heartbeat:Connect(function()
        if Config.Enabled then
            HideAllNameTags()
        end
    end)
    table.insert(Connections, mainLoop)
    
    -- Watch CoreGui changes
    local coreGuiConn = CoreGui.DescendantAdded:Connect(function(descendant)
        if Config.Enabled then
            MonitorTextObject(descendant)
        end
    end)
    table.insert(Connections, coreGuiConn)
    
    -- Watch PlayerGui changes
    pcall(function()
        local playerGui = LocalPlayer:WaitForChild("PlayerGui", 5)
        if playerGui then
            local playerGuiConn = playerGui.DescendantAdded:Connect(function(descendant)
                if Config.Enabled then
                    MonitorTextObject(descendant)
                end
            end)
            table.insert(Connections, playerGuiConn)
        end
    end)
    
    -- Character added listeners
    for _, player in pairs(Players:GetPlayers()) do
        local conn = player.CharacterAdded:Connect(function(character)
            task.wait(0.3)
            if Config.Enabled then
                local humanoid = character:FindFirstChildOfClass("Humanoid")
                if humanoid then
                    HideHumanoidName(humanoid)
                end
                
                local head = character:FindFirstChild("Head")
                if head then
                    for _, child in pairs(head:GetChildren()) do
                        if child:IsA("BillboardGui") then
                            child.Enabled = false
                        end
                    end
                end
            end
        end)
        table.insert(Connections, conn)
    end
    
    -- Player added
    local playerAddedConn = Players.PlayerAdded:Connect(function(player)
        local conn = player.CharacterAdded:Connect(function(character)
            task.wait(0.3)
            if Config.Enabled then
                local humanoid = character:FindFirstChildOfClass("Humanoid")
                if humanoid then
                    HideHumanoidName(humanoid)
                end
                
                local head = character:FindFirstChild("Head")
                if head then
                    for _, child in pairs(head:GetChildren()) do
                        if child:IsA("BillboardGui") then
                            child.Enabled = false
                        end
                    end
                end
            end
        end)
        table.insert(Connections, conn)
    end)
    table.insert(Connections, playerAddedConn)
    
    -- Re-scan periodically to catch missed elements
    local rescanLoop = task.spawn(function()
        while task.wait(2) do
            if Config.Enabled then
                ProtectLeaderboard()
                ProtectChat()
            end
        end
    end)
end

--================================--
--     STOP PROTECTION           --
--================================--

local function StopProtection()
    -- Restore humanoid names
    for _, player in pairs(Players:GetPlayers()) do
        pcall(function()
            local character = player.Character
            if character then
                local humanoid = character:FindFirstChildOfClass("Humanoid")
                if humanoid then
                    humanoid.DisplayDistanceType = Enum.HumanoidDisplayDistanceType.Viewer
                end
                
                local head = character:FindFirstChild("Head")
                if head then
                    for _, child in pairs(head:GetChildren()) do
                        if child:IsA("BillboardGui") then
                            child.Enabled = true
                        end
                    end
                end
            end
        end)
    end
    
    -- Clear monitored objects
    MonitoredObjects = {}
end

--================================--
--     COMPACT GUI               --
--================================--

local function CreateGUI()
    pcall(function()
        if CoreGui:FindFirstChild("SwiftbaraProtectGUI") then
            CoreGui.SwiftbaraProtectGUI:Destroy()
        end
    end)
    
    local ScreenGui = Instance.new("ScreenGui")
    ScreenGui.Name = "SwiftbaraProtectGUI"
    ScreenGui.ResetOnSpawn = false
    
    -- Main compact frame
    local MainFrame = Instance.new("Frame")
    MainFrame.Name = "MainFrame"
    MainFrame.Size = UDim2.new(0, 200, 0, 45)
    MainFrame.Position = UDim2.new(0, 10, 0, 10)
    MainFrame.BackgroundColor3 = Color3.fromRGB(25, 25, 35)
    MainFrame.BorderSizePixel = 0
    MainFrame.Parent = ScreenGui
    
    local Corner = Instance.new("UICorner")
    Corner.CornerRadius = UDim.new(0, 8)
    Corner.Parent = MainFrame
    
    local Stroke = Instance.new("UIStroke")
    Stroke.Color = Color3.fromRGB(100, 200, 255)
    Stroke.Thickness = 2
    Stroke.Parent = MainFrame
    
    -- Title
    local Title = Instance.new("TextLabel")
    Title.Size = UDim2.new(0, 130, 1, 0)
    Title.Position = UDim2.new(0, 10, 0, 0)
    Title.BackgroundTransparency = 1
    Title.Text = "🛡️ SwiftbaraProtect"
    Title.TextColor3 = Color3.fromRGB(100, 200, 255)
    Title.TextSize = 12
    Title.Font = Enum.Font.GothamBold
    Title.TextXAlignment = Enum.TextXAlignment.Left
    Title.Parent = MainFrame
    
    -- Toggle Button
    local ToggleBtn = Instance.new("TextButton")
    ToggleBtn.Size = UDim2.new(0, 50, 0, 30)
    ToggleBtn.Position = UDim2.new(1, -58, 0.5, -15)
    ToggleBtn.BackgroundColor3 = Color3.fromRGB(50, 200, 100)
    ToggleBtn.Text = "ON"
    ToggleBtn.TextColor3 = Color3.fromRGB(255, 255, 255)
    ToggleBtn.TextSize = 14
    ToggleBtn.Font = Enum.Font.GothamBold
    ToggleBtn.Parent = MainFrame
    
    local BtnCorner = Instance.new("UICorner")
    BtnCorner.CornerRadius = UDim.new(0, 6)
    BtnCorner.Parent = ToggleBtn
    
    -- Toggle function
    ToggleBtn.MouseButton1Click:Connect(function()
        Config.Enabled = not Config.Enabled
        
        if Config.Enabled then
            ToggleBtn.Text = "ON"
            ToggleBtn.BackgroundColor3 = Color3.fromRGB(50, 200, 100)
            Stroke.Color = Color3.fromRGB(100, 200, 255)
            MonitoredObjects = {}
            ScanAndProtect()
            ProtectLeaderboard()
            ProtectChat()
        else
            ToggleBtn.Text = "OFF"
            ToggleBtn.BackgroundColor3 = Color3.fromRGB(200, 60, 60)
            Stroke.Color = Color3.fromRGB(200, 60, 60)
            StopProtection()
        end
    end)
    
    -- Dragging
    local dragging, dragStart, startPos
    
    MainFrame.InputBegan:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
            dragging = true
            dragStart = input.Position
            startPos = MainFrame.Position
        end
    end)
    
    MainFrame.InputEnded:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
            dragging = false
        end
    end)
    
    UserInputService.InputChanged:Connect(function(input)
        if dragging and (input.UserInputType == Enum.UserInputType.MouseMovement or input.UserInputType == Enum.UserInputType.Touch) then
            local delta = input.Position - dragStart
            MainFrame.Position = UDim2.new(startPos.X.Scale, startPos.X.Offset + delta.X, startPos.Y.Scale, startPos.Y.Offset + delta.Y)
        end
    end)
    
    -- Hide/Show with RightCtrl
    UserInputService.InputBegan:Connect(function(input, processed)
        if processed then return end
        if input.KeyCode == Enum.KeyCode.RightControl then
            MainFrame.Visible = not MainFrame.Visible
        end
    end)
    
    -- Parent GUI
    pcall(function()
        if syn and syn.protect_gui then
            syn.protect_gui(ScreenGui)
            ScreenGui.Parent = CoreGui
        elseif gethui then
            ScreenGui.Parent = gethui()
        else
            ScreenGui.Parent = CoreGui
        end
    end)
    
    return ScreenGui
end

--================================--
--     INITIALIZE                --
--================================--

CreateGUI()
StartProtection()



print("[SwiftbaraProtect] Press RIGHT CTRL to hide/show GUI")

--================================--
--     GLOBAL ACCESS             --
--================================--

getgenv().SwiftbaraProtect = {
    SetMyName = function(name)
        Config.MySpoofName = name
        MonitoredObjects = {}
        ScanAndProtect()
    end,
    
    SetOthersName = function(name)
        Config.OthersSpoofName = name
        MonitoredObjects = {}
        ScanAndProtect()
    end,
    
    Toggle = function(state)
        Config.Enabled = state
        if not state then 
            StopProtection() 
        else
            MonitoredObjects = {}
            ScanAndProtect()
            ProtectLeaderboard()
            ProtectChat()
        end
    end,
    
    Destroy = function()
        Config.Enabled = false
        StopProtection()
        for _, conn in pairs(Connections) do
            pcall(function() conn:Disconnect() end)
        end
        pcall(function() CoreGui.SwiftbaraProtectGUI:Destroy() end)

    end
}
`;

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).send(script);

}
