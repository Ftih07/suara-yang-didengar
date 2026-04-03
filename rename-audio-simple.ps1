# Audio Rename Script - Simple Version

param(
    [switch]$DryRun,
    [switch]$Backup
)

$audioDir = ".\public\audio"
$backupDir = ".\public\audio-backup-rename"

Write-Host "`n=== AUDIO RENAME SCRIPT ===" -ForegroundColor Cyan
Write-Host "Rename files to match code convention`n" -ForegroundColor Gray

# Rename mapping
$renameMap = @{
    "bgsnd menu.mp3" = "bg-menu.mp3"
    "bgsnd kalem (selesai).mp3" = "bg-calm.mp3"
    "bgsnd tegang (masalah).mp3" = "bg-tense.mp3"
    "narasi cp1  #1.mp3" = "narrator-ch1-intro.mp3"
    "narasi cp1 #2.mp3" = "narrator-ch1-conclusion.mp3"
    "narasi cp2 #1.mp3" = "narrator-ch2-intro.mp3"
    "narasi cp2 #2.mp3" = "narrator-ch2-conclusion.mp3"
    "narasi cp3 #1.mp3" = "narrator-ch3-intro.mp3"
    "narasi cp3 #2.mp3" = "narrator-ch3-conclusion.mp3"
    "narasi cp5 #1.mp3" = "narrator-ch5-intro.mp3"
    "narasi cp5 #2.mp3" = "narrator-ch5-conclusion.mp3"
}

# Check directory
Write-Host "[1/3] Checking audio directory..." -ForegroundColor Yellow
if (-not (Test-Path $audioDir)) {
    Write-Host "ERROR: $audioDir not found!" -ForegroundColor Red
    exit 1
}
Write-Host "OK" -ForegroundColor Green

# Backup
if ($Backup -and -not $DryRun) {
    Write-Host "`n[2/3] Creating backup..." -ForegroundColor Yellow
    
    if (Test-Path $backupDir) {
        $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
        $backupDir = ".\public\audio-backup-rename-$timestamp"
    }
    
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    Copy-Item -Path "$audioDir\*.mp3" -Destination $backupDir -Force
    Write-Host "Backup: $backupDir" -ForegroundColor Green
} else {
    Write-Host "`n[2/3] Skipping backup..." -ForegroundColor Gray
}

# Preview/Execute rename
Write-Host "`n[3/3] Rename operations..." -ForegroundColor Yellow

if ($DryRun) {
    Write-Host "`nDRY RUN MODE - Preview only`n" -ForegroundColor Magenta
}

Write-Host "Old Name                          ->  New Name" -ForegroundColor Gray
Write-Host "----------------------------------------------------------------" -ForegroundColor Gray

$successCount = 0
$skipCount = 0

foreach ($oldName in $renameMap.Keys) {
    $newName = $renameMap[$oldName]
    $oldPath = Join-Path $audioDir $oldName
    $newPath = Join-Path $audioDir $newName
    
    if (Test-Path $oldPath) {
        $oldPad = $oldName.PadRight(32)
        $newPad = $newName
        
        if ($DryRun) {
            Write-Host "$oldPad  ->  $newPad" -ForegroundColor White
        } else {
            try {
                Rename-Item -Path $oldPath -NewName $newName -ErrorAction Stop
                Write-Host "$oldPad  ->  $newPad [OK]" -ForegroundColor Green
                $successCount++
            } catch {
                Write-Host "$oldPad  ->  ERROR: $_" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "$oldName [SKIP - not found]" -ForegroundColor Gray
        $skipCount++
    }
}

# Summary
Write-Host "`n=== SUMMARY ===" -ForegroundColor Cyan
if ($DryRun) {
    Write-Host "Mode: DRY RUN (no changes made)" -ForegroundColor Magenta
    Write-Host "Files to rename: $($renameMap.Count - $skipCount)" -ForegroundColor White
    Write-Host "`nTo execute for real, run:" -ForegroundColor Yellow
    Write-Host "  .\rename-audio-simple.ps1 -Backup" -ForegroundColor White
} else {
    Write-Host "Files renamed: $successCount" -ForegroundColor Green
    Write-Host "Files skipped: $skipCount" -ForegroundColor Yellow
}

Write-Host "`nNOTE: Chapter 4 files NOT renamed (manual handling required)" -ForegroundColor Cyan
Write-Host "  narasi cp4 #2.mp3" -ForegroundColor White
Write-Host "  narasi cp4 #3.mp3" -ForegroundColor White
Write-Host "  narasi cp4 #4.mp3" -ForegroundColor White

Write-Host "`nUsage:" -ForegroundColor White
Write-Host "  .\rename-audio-simple.ps1              # Rename all files" -ForegroundColor Gray
Write-Host "  .\rename-audio-simple.ps1 -DryRun      # Preview only" -ForegroundColor Gray
Write-Host "  .\rename-audio-simple.ps1 -Backup      # With backup" -ForegroundColor Gray
Write-Host ""
