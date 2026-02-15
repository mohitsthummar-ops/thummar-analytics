# ============================================
# PowerShell Script: Install Git & Push to GitHub
# ============================================

# IMPORTANT: Replace YOUR-USERNAME with your actual GitHub username
$GitHubUsername = "YOUR-USERNAME"
$RepoName = "thummar-analytics"
$GitHubRepoUrl = "https://github.com/$GitHubUsername/$RepoName.git"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Git Installation and Repository Setup" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

# ============================================
# STEP 1: Check if Git is already installed
# ============================================
Write-Host "[STEP 1] Checking if Git is already installed..." -ForegroundColor Yellow

$gitPath = Get-Command git -ErrorAction SilentlyContinue

if ($gitPath) {
    Write-Host "Git is already installed at: $($gitPath.Source)" -ForegroundColor Green
    $currentVersion = git --version
    Write-Host "Version: $currentVersion" -ForegroundColor Green
} else {
    Write-Host "Git is not found. Installing Git...`n" -ForegroundColor Red

    # ============================================
    # STEP 2: Install Git using winget
    # ============================================
    Write-Host "[STEP 2] Attempting to install Git using winget..." -ForegroundColor Yellow

    try {
        # Check if winget is available
        $wingetCheck = Get-Command winget -ErrorAction SilentlyContinue
        if ($wingetCheck) {
            Write-Host "winget found. Installing Git..." -ForegroundColor Cyan
            winget install --id Git.Git -e --source winget --accept-package-agreements --accept-source-agreements
            Write-Host "Git installed successfully via winget!" -ForegroundColor Green
        } else {
            throw "winget not available"
        }
    } catch {
        # ============================================
        # Alternative: Download and install Git silently
        # ============================================
        Write-Host "winget not available. Downloading Git installer..." -ForegroundColor Yellow
        
        $gitInstallerUrl = "https://github.com/git-for-windows/git/releases/download/v2.43.0.windows.1/Git-2.43.0-64-bit.exe"
        $installerPath = "$env:TEMP\Git-2.43.0-64-bit.exe"
        
        Write-Host "Downloading Git from: $gitInstallerUrl" -ForegroundColor Cyan
        Invoke-WebRequest -Uri $gitInstallerUrl -OutFile $installerPath -UseBasicParsing
        
        Write-Host "Installing Git silently..." -ForegroundColor Cyan
        Start-Process -FilePath $installerPath -ArgumentList "/VERYSILENT", "/NORESTART", "/NOCANCEL", "/SP-", "/CLOSEAPPLICATIONS", "/RESTARTAPPLICATIONS", "/COMPONENTS=`"icons,ext\reg\shellhere,assoc,assoc_sh`"" -Wait
        
        Write-Host "Git installed successfully!" -ForegroundColor Green
    }

    # ============================================
    # STEP 3: Refresh PATH environment variable
    # ============================================
    Write-Host "`n[STEP 3] Refreshing PATH environment..." -ForegroundColor Yellow
    
    # Refresh environment variables
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    
    # Also add common Git paths
    $gitPaths = @(
        "C:\Program Files\Git\cmd",
        "C:\Program Files (x86)\Git\cmd",
        "C:\Program Files\Git\bin"
    )
    
    foreach ($path in $gitPaths) {
        if (Test-Path $path) {
            if ($env:Path -notlike "*$path*") {
                $env:Path = "$path;$env:Path"
                [System.Environment]::SetEnvironmentVariable("Path", $env:Path, "User")
            }
        }
    }
}

# ============================================
# STEP 4: Verify Git installation
# ============================================
Write-Host "`n[STEP 4] Verifying Git installation..." -ForegroundColor Yellow

# Refresh PATH again
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Wait a moment for PATH to update
Start-Sleep -Seconds 2

# Try to get Git version
try {
    $gitVersion = git --version
    Write-Host "SUCCESS! Git is working: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Git command not found. Please restart your terminal and run this script again." -ForegroundColor Red
    Write-Host "Or manually add Git to your PATH." -ForegroundColor Red
    exit 1
}

# ============================================
# STEP 5: Configure Git (if needed)
# ============================================
Write-Host "`n[STEP 5] Configuring Git..." -ForegroundColor Yellow

# Check if user.name is set
$userName = git config --global user.name 2>$null
if (-not $userName) {
    Write-Host "Git user.name not set. Please enter your name:" -ForegroundColor Yellow
    $global:GitUserName = Read-Host "Your Name"
    git config --global user.name "$GitUserName"
    Write-Host "Git user.name configured!" -ForegroundColor Green
} else {
    Write-Host "Git user.name already set: $userName" -ForegroundColor Green
}

# Check if user.email is set
$userEmail = git config --global user.email 2>$null
if (-not $userEmail) {
    Write-Host "Git user.email not set. Please enter your email:" -ForegroundColor Yellow
    $global:GitUserEmail = Read-Host "Your Email"
    git config --global user.email "$GitUserEmail"
    Write-Host "Git user.email configured!" -ForegroundColor Green
} else {
    Write-Host "Git user.email already set: $userEmail" -ForegroundColor Green
}

# ============================================
# STEP 6: Initialize Git repository
# ============================================
Write-Host "`n[STEP 6] Initializing Git repository..." -ForegroundColor Yellow

# Change to project directory
Set-Location "C:\Users\HP\OneDrive\Desktop\thummar-analytics"

# Initialize Git repo
git init
Write-Host "Git repository initialized!" -ForegroundColor Green

# ============================================
# STEP 7: Add all files
# ============================================
Write-Host "`n[STEP 7] Adding all files..." -ForegroundColor Yellow

git add .
Write-Host "All files added!" -ForegroundColor Green

# ============================================
# STEP 8: Commit with message
# ============================================
Write-Host "`n[STEP 8] Committing with message..." -ForegroundColor Yellow

git commit -m "Initial commit - Thummar Analytics"
Write-Host "Committed successfully!" -ForegroundColor Green

# ============================================
# STEP 9: Connect to GitHub and push
# ============================================
Write-Host "`n[STEP 9] Connecting to GitHub and pushing..." -ForegroundColor Yellow

# Add remote origin
git remote add origin $GitHubRepoUrl
Write-Host "Remote origin added: $GitHubRepoUrl" -ForegroundColor Green

# Push to main branch
git branch -M main
git push -u origin main
Write-Host "Pushed to GitHub successfully!" -ForegroundColor Green

# ============================================
# COMPLETION
# ============================================
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "ALL DONE! 🎉" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Repository: $GitHubRepoUrl" -ForegroundColor White
Write-Host "Local path: C:\Users\HP\OneDrive\Desktop\thummar-analytics" -ForegroundColor White
Write-Host "`nNext time, use these commands:" -ForegroundColor Yellow
Write-Host "  git add ." -ForegroundColor Gray
Write-Host '  git commit -m "Your message"' -ForegroundColor Gray
Write-Host "  git push" -ForegroundColor Gray
