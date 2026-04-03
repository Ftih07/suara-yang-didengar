# Audio Normalization Script - Simple Version
# Requires: ffmpeg installed and in PATH

param(
    [switch]$DryRun,
    [switch]$Backup
)

$audioDir = ".\public\audio"
$backupDir = ".\public\audio-backup"

Write-Host "`n=== AUDIO NORMALIZATION SCRIPT ===" -ForegroundColor Cyan
Write-Host "Target: BG Music = -18 LUFS, Narrator = -16 LUFS`n" -ForegroundColor Gray

# Check ffmpeg
Write-Host "[1/5] Checking ffmpeg..." -ForegroundColor Yellow
try {
    $null = ffmpeg -version 2>&1
    Write-Host "OK - ffmpeg found" -ForegroundColor Green
} catch {
    Write-Host "ERROR: ffmpeg not found!" -ForegroundColor Red
    Write-Host "Install from: https://ffmpeg.org/download.html" -ForegroundColor Yellow
    exit 1
}

# Check audio directory
Write-Host "`n[2/5] Checking audio directory..." -ForegroundColor Yellow
if (-not (Test-Path $audioDir)) {
    Write-Host "ERROR: $audioDir not found!" -ForegroundColor Red
    exit 1
}

$audioFiles = Get-ChildItem -Path $audioDir -Filter "*.mp3"
Write-Host "Found $($audioFiles.Count) MP3 files" -ForegroundColor Green

# Backup if requested
if ($Backup -and -not $DryRun) {
    Write-Host "`n[3/5] Creating backup..." -ForegroundColor Yellow
    
    if (Test-Path $backupDir) {
        $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
        $backupDir = ".\public\audio-backup-$timestamp"
    }
    
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    Copy-Item -Path "$audioDir\*.mp3" -Destination $backupDir -Force
    Write-Host "Backup created: $backupDir" -ForegroundColor Green
} else {
    Write-Host "`n[3/5] Skipping backup..." -ForegroundColor Gray
}

# Analyze current levels
Write-Host "`n[4/5] Analyzing audio levels..." -ForegroundColor Yellow

foreach ($file in $audioFiles) {
    $filename = $file.Name
    Write-Host "  $filename..." -NoNewline
    
    # Quick loudness check
    $output = ffmpeg -i "$($file.FullName)" -af "loudnorm=print_format=json" -f null - 2>&1 | Out-String
    
    if ($output -match '"input_i"\s*:\s*"([^"]+)"') {
        $currentLoudness = [math]::Round([double]$matches[1], 1)
        Write-Host " Current: $currentLoudness LUFS" -ForegroundColor Cyan
    } else {
        Write-Host " Could not analyze" -ForegroundColor Yellow
    }
}

# Normalize
Write-Host "`n[5/5] Normalizing..." -ForegroundColor Yellow

if ($DryRun) {
    Write-Host "DRY RUN MODE - No files will be modified" -ForegroundColor Magenta
    Write-Host "`nTo normalize for real, run:" -ForegroundColor Yellow
    Write-Host "  .\normalize-audio-simple.ps1 -Backup" -ForegroundColor White
} else {
    $targetBgMusic = -18.0
    $targetNarrator = -16.0
    
    foreach ($file in $audioFiles) {
        $filename = $file.Name
        
        # Determine target
        $target = if ($filename -like "*bgsnd*" -or $filename -like "*bg-*") { 
            $targetBgMusic 
        } else { 
            $targetNarrator 
        }
        
        $type = if ($target -eq $targetBgMusic) { "BG" } else { "Narrator" }
        
        Write-Host "  Processing: $filename ($type, target: $target LUFS)..." -NoNewline
        
        $tempFile = "$($file.DirectoryName)\temp_$($file.Name)"
        
        # Single-pass normalization (faster)
        $result = ffmpeg -i "$($file.FullName)" -af "loudnorm=I=$target`:TP=-1.5`:LRA=11" -ar 44100 -b:a 192k "$tempFile" -y 2>&1
        
        if ($LASTEXITCODE -eq 0 -and (Test-Path $tempFile)) {
            Move-Item -Path $tempFile -Destination $file.FullName -Force
            Write-Host " DONE" -ForegroundColor Green
        } else {
            Write-Host " ERROR" -ForegroundColor Red
            if (Test-Path $tempFile) { Remove-Item $tempFile -Force }
        }
    }
    
    Write-Host "`nNormalization complete!" -ForegroundColor Green
}

Write-Host "`nUsage:" -ForegroundColor White
Write-Host "  .\normalize-audio-simple.ps1              # Normalize all files" -ForegroundColor Gray
Write-Host "  .\normalize-audio-simple.ps1 -DryRun      # Preview only" -ForegroundColor Gray
Write-Host "  .\normalize-audio-simple.ps1 -Backup      # With backup" -ForegroundColor Gray
Write-Host ""
