# ============================================================
# AniKode Standalone Binary Builder (Windows)
# Uses Node.js Single Executable Applications (SEA)
# ============================================================

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "  ================================" -ForegroundColor Cyan
Write-Host "   AniKode Binary Builder v1.0.0" -ForegroundColor Cyan
Write-Host "  ================================" -ForegroundColor Cyan
Write-Host ""

# Step 0: Ensure dist/ directory exists
if (-not (Test-Path "dist")) {
    New-Item -ItemType Directory -Path "dist" | Out-Null
}

# Step 1: Bundle all JS files into a single file using esbuild
Write-Host "[1/4] Bundling source files with esbuild..." -ForegroundColor Yellow
npx -y esbuild runner.js --bundle --platform=node --outfile=dist/anikode-bundle.js 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR: esbuild bundling failed!" -ForegroundColor Red
    exit 1
}
Write-Host "  Done: dist/anikode-bundle.js created" -ForegroundColor Green

# Step 2: Generate the SEA preparation blob
Write-Host "[2/4] Generating SEA blob..." -ForegroundColor Yellow
node --experimental-sea-config sea-config.json 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR: SEA blob generation failed!" -ForegroundColor Red
    exit 1
}
Write-Host "  Done: dist/sea-prep.blob created" -ForegroundColor Green

# Step 3: Copy node.exe as base binary
Write-Host "[3/4] Copying node.exe as base binary..." -ForegroundColor Yellow
$nodeExe = (Get-Command node).Source
Copy-Item $nodeExe "dist/anikode.exe" -Force
Write-Host "  Done: dist/anikode.exe copied" -ForegroundColor Green

# Step 4: Inject the SEA blob into the binary
Write-Host "[4/4] Injecting AniKode compiler into binary..." -ForegroundColor Yellow
npx -y postject dist/anikode.exe NODE_SEA_BLOB dist/sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 --overwrite 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR: Blob injection failed!" -ForegroundColor Red
    exit 1
}

# Step 5: Get final binary size
$size = (Get-Item "dist/anikode.exe").Length / 1MB
$sizeRounded = [math]::Round($size, 1)

Write-Host ""
Write-Host "  ============================================" -ForegroundColor Green
Write-Host "   BUILD SUCCESSFUL!" -ForegroundColor Green
Write-Host "   Binary: dist/anikode.exe ($sizeRounded MB)" -ForegroundColor Green
Write-Host "  ============================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Test it: .\dist\anikode.exe --version" -ForegroundColor Cyan
Write-Host ""
