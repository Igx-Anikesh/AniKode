# ============================================================
# AniKode Windows Installer Script
# Registers .kode file extension, logo, and PATH
# Run as: powershell -ExecutionPolicy Bypass -File install.ps1
# ============================================================

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "  =======================================" -ForegroundColor Cyan
Write-Host "   AniKode Installer for Windows v1.0.0" -ForegroundColor Cyan
Write-Host "  =======================================" -ForegroundColor Cyan
Write-Host ""

# --- Configuration ---
$installDir = "$env:LOCALAPPDATA\AniKode"
$exeSource  = Join-Path $PSScriptRoot "dist\anikode.exe"
$icoSource  = Join-Path $PSScriptRoot "assets\anikode_logo.ico"

# --- Pre-checks ---
if (-not (Test-Path $exeSource)) {
    Write-Host "  ERROR: dist/anikode.exe not found!" -ForegroundColor Red
    Write-Host "  Run 'npm run build' first to compile the binary." -ForegroundColor Yellow
    exit 1
}

# Step 1: Create install directory
Write-Host "[1/4] Creating install directory..." -ForegroundColor Yellow
if (-not (Test-Path $installDir)) {
    New-Item -ItemType Directory -Path $installDir -Force | Out-Null
}
Write-Host "  Location: $installDir" -ForegroundColor Gray

# Step 2: Copy binary and icon
Write-Host "[2/4] Copying AniKode binary..." -ForegroundColor Yellow
Copy-Item $exeSource "$installDir\anikode.exe" -Force
Write-Host "  Copied anikode.exe" -ForegroundColor Green

if (Test-Path $icoSource) {
    Copy-Item $icoSource "$installDir\anikode_logo.ico" -Force
    Write-Host "  Copied anikode_logo.ico" -ForegroundColor Green
} else {
    Write-Host "  WARNING: assets/anikode_logo.ico not found, skipping icon." -ForegroundColor Yellow
}

# Step 3: Add to user PATH (non-admin, does not affect system PATH)
Write-Host "[3/4] Adding AniKode to PATH..." -ForegroundColor Yellow
$userPath = [Environment]::GetEnvironmentVariable("PATH", "User")
$pathList = if ($userPath) { ($userPath -split ';') | Where-Object { $_ -ne '' } } else { @() }
if ($installDir -notin $pathList) {
    $newPath = if ($userPath) { "$userPath;$installDir" } else { $installDir }
    [Environment]::SetEnvironmentVariable("PATH", $newPath, "User")
    Write-Host "  Added $installDir to user PATH" -ForegroundColor Green
    Write-Host "  (Restart your terminal for PATH changes to take effect)" -ForegroundColor Gray
} else {
    Write-Host "  Already in PATH, skipping." -ForegroundColor Gray
}

# Step 4: Register .kode file extension (user-level, no admin needed)
Write-Host "[4/4] Registering .kode file extension..." -ForegroundColor Yellow

$regBase = "HKCU:\Software\Classes"

# Register .kode extension
New-Item -Path "$regBase\.kode" -Force | Out-Null
Set-ItemProperty -Path "$regBase\.kode" -Name "(Default)" -Value "AniKodeFile"

# Register AniKodeFile type
New-Item -Path "$regBase\AniKodeFile" -Force | Out-Null
Set-ItemProperty -Path "$regBase\AniKodeFile" -Name "(Default)" -Value "AniKode Source Code File"

# Set icon (if .ico exists)
$icoPath = "$installDir\anikode_logo.ico"
if (Test-Path $icoPath) {
    New-Item -Path "$regBase\AniKodeFile\DefaultIcon" -Force | Out-Null
    Set-ItemProperty -Path "$regBase\AniKodeFile\DefaultIcon" -Name "(Default)" -Value "`"$icoPath`",0"
    Write-Host "  Registered custom icon for .kode files" -ForegroundColor Green
}

# Register "Open with AniKode" right-click context menu
New-Item -Path "$regBase\AniKodeFile\shell\run_anikode" -Force | Out-Null
Set-ItemProperty -Path "$regBase\AniKodeFile\shell\run_anikode" -Name "(Default)" -Value "Run with AniKode"

New-Item -Path "$regBase\AniKodeFile\shell\run_anikode\command" -Force | Out-Null
Set-ItemProperty -Path "$regBase\AniKodeFile\shell\run_anikode\command" -Name "(Default)" -Value "`"$installDir\anikode.exe`" run `"%1`""

# Register "Open in VS Code" if available
$vscodePath = (Get-Command code -ErrorAction SilentlyContinue)
if ($vscodePath) {
    New-Item -Path "$regBase\AniKodeFile\shell\open\command" -Force | Out-Null
    Set-ItemProperty -Path "$regBase\AniKodeFile\shell\open\command" -Name "(Default)" -Value "`"$($vscodePath.Source)`" `"%1`""
    Write-Host "  Registered 'Open in VS Code' for .kode files" -ForegroundColor Green
}

Write-Host "  Registered .kode file extension" -ForegroundColor Green

Write-Host ""
Write-Host "  ============================================" -ForegroundColor Green
Write-Host "   INSTALLATION COMPLETE!" -ForegroundColor Green
Write-Host "  ============================================" -ForegroundColor Green
Write-Host ""
Write-Host "  You can now:" -ForegroundColor Cyan
Write-Host "    1. Open a new terminal and run: anikode --version" -ForegroundColor White
Write-Host "    2. Run .kode files from anywhere: anikode run hello.kode" -ForegroundColor White
Write-Host "    3. Right-click any .kode file -> 'Run with AniKode'" -ForegroundColor White
Write-Host ""
