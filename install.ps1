# ============================================================
# AniKode Universal Windows Installer Script
# Automatically installs AniKode, registers .kode files, and configures PATH
# Run as: irm https://raw.githubusercontent.com/Igx-Anikesh/AniKode/main/install.ps1 | iex
# ============================================================

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "  =======================================" -ForegroundColor Cyan
Write-Host "   AniKode Universal Installer for Windows" -ForegroundColor Cyan
Write-Host "  =======================================" -ForegroundColor Cyan
Write-Host ""

# --- Configuration ---
$installDir = "$env:LOCALAPPDATA\AniKode"
$exeSource  = Join-Path $PSScriptRoot "dist\anikode.exe"
$icoSource  = Join-Path $PSScriptRoot "assets\anikode_logo.ico"
$downloadUrl = "https://github.com/Igx-Anikesh/AniKode/releases/latest/download/anikode.exe"

# Step 1: Create install directory
Write-Host "[1/4] Setting up install directory..." -ForegroundColor Yellow
if (-not (Test-Path $installDir)) {
    New-Item -ItemType Directory -Path $installDir -Force | Out-Null
}
Write-Host "  Location: $installDir" -ForegroundColor Gray

# Step 2: Copy or Download binary
Write-Host "[2/4] Installing AniKode binary..." -ForegroundColor Yellow
if (Test-Path $exeSource) {
    Copy-Item $exeSource "$installDir\anikode.exe" -Force
    Write-Host "  Installed local anikode.exe" -ForegroundColor Green
} else {
    Write-Host "  Downloading latest anikode.exe from GitHub Releases..." -ForegroundColor Cyan
    try {
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 -bor [Net.SecurityProtocolType]::Tls13
        Invoke-WebRequest -Uri $downloadUrl -OutFile "$installDir\anikode.exe" -UseBasicParsing
        Write-Host "  Downloaded and installed anikode.exe" -ForegroundColor Green
    } catch {
        Write-Host "  ERROR: Failed to download anikode.exe. Check your internet connection or download manually." -ForegroundColor Red
        exit 1
    }
}

if (Test-Path $icoSource) {
    Copy-Item $icoSource "$installDir\anikode_logo.ico" -Force
}

# Step 3: Add to user PATH (non-admin, permanent)
Write-Host "[3/4] Adding AniKode to Windows PATH..." -ForegroundColor Yellow
$userPath = [Environment]::GetEnvironmentVariable("PATH", "User")
$pathList = if ($userPath) { ($userPath -split ';') | Where-Object { $_ -ne '' } } else { @() }
if ($installDir -notin $pathList) {
    $newPath = if ($userPath) { "$userPath;$installDir" } else { $installDir }
    [Environment]::SetEnvironmentVariable("PATH", $newPath, "User")
    Write-Host "  Added $installDir to user PATH" -ForegroundColor Green
    $env:PATH = "$env:PATH;$installDir"
} else {
    Write-Host "  Already present in user PATH." -ForegroundColor Gray
}

# Step 4: Register .kode file extension & context menu
Write-Host "[4/4] Registering .kode file association..." -ForegroundColor Yellow
try {
    $regBase = "HKCU:\Software\Classes"

    # Register .kode extension
    New-Item -Path "$regBase\.kode" -Force | Out-Null
    Set-ItemProperty -Path "$regBase\.kode" -Name "(Default)" -Value "AniKodeFile"

    # Register AniKodeFile type
    New-Item -Path "$regBase\AniKodeFile" -Force | Out-Null
    Set-ItemProperty -Path "$regBase\AniKodeFile" -Name "(Default)" -Value "AniKode Source Code File"

    # Register "Run with AniKode" right-click context menu
    New-Item -Path "$regBase\AniKodeFile\shell\run_anikode" -Force | Out-Null
    Set-ItemProperty -Path "$regBase\AniKodeFile\shell\run_anikode" -Name "(Default)" -Value "Run with AniKode"

    New-Item -Path "$regBase\AniKodeFile\shell\run_anikode\command" -Force | Out-Null
    Set-ItemProperty -Path "$regBase\AniKodeFile\shell\run_anikode\command" -Name "(Default)" -Value "`"$installDir\anikode.exe`" run `"%1`""

    Write-Host "  Registered .kode file association & right-click menu." -ForegroundColor Green
} catch {
    Write-Host "  Note: Registry registration skipped (non-critical)." -ForegroundColor Gray
}

Write-Host ""
Write-Host "  ============================================" -ForegroundColor Green
Write-Host "   INSTALLATION SUCCESSFUL!" -ForegroundColor Green
Write-Host "  ============================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Quickstart:" -ForegroundColor Cyan
Write-Host "    1. Open any terminal (Command Prompt, PowerShell, VS Code)" -ForegroundColor White
Write-Host "    2. Check version: anikode --version" -ForegroundColor White
Write-Host "    3. Run scripts:   anikode run main.kode" -ForegroundColor White
Write-Host ""
