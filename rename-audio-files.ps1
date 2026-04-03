# ============================================================================
# Script: rename-audio-files.ps1
# Deskripsi: Rename semua file audio agar sesuai dengan naming convention kode
# ============================================================================

param(
    [switch]$DryRun,  # Mode preview tanpa mengubah file
    [switch]$Backup   # Buat backup sebelum rename
)

$ErrorActionPreference = "Stop"
$audioDir = ".\public\audio"
$backupDir = ".\public\audio-backup-rename"

# Warna untuk output
function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

# Header
Write-ColorOutput "`n╔════════════════════════════════════════════════════════════╗" "Cyan"
Write-ColorOutput "║         AUDIO RENAME SCRIPT v1.0                          ║" "Cyan"
Write-ColorOutput "║         Suara Yang Didengar - File Renamer               ║" "Cyan"
Write-ColorOutput "╚════════════════════════════════════════════════════════════╝`n" "Cyan"

# Mapping: old filename -> new filename
$renameMap = @{
    # Background Music
    "bgsnd menu.mp3" = "bg-menu.mp3"
    "bgsnd kalem (selesai).mp3" = "bg-calm.mp3"
    "bgsnd tegang (masalah).mp3" = "bg-tense.mp3"
    
    # Narrator Audio - Chapter 1
    "narasi cp1  #1.mp3" = "narrator-ch1-intro.mp3"      # Note: 2 spaces in original
    "narasi cp1 #2.mp3" = "narrator-ch1-conclusion.mp3"
    
    # Narrator Audio - Chapter 2
    "narasi cp2 #1.mp3" = "narrator-ch2-intro.mp3"
    "narasi cp2 #2.mp3" = "narrator-ch2-conclusion.mp3"
    
    # Narrator Audio - Chapter 3
    "narasi cp3 #1.mp3" = "narrator-ch3-intro.mp3"
    "narasi cp3 #2.mp3" = "narrator-ch3-conclusion.mp3"
    
    # Narrator Audio - Chapter 4 (akan di-skip, user handle sendiri)
    # "narasi cp4 #2.mp3" = "narrator-ch4-intro.mp3"
    # "narasi cp4 #3.mp3" = "narrator-ch4-conclusion.mp3"
    # "narasi cp4 #4.mp3" = "narrator-ch4-extra.mp3"
    
    # Narrator Audio - Chapter 5
    "narasi cp5 #1.mp3" = "narrator-ch5-intro.mp3"
    "narasi cp5 #2.mp3" = "narrator-ch5-conclusion.mp3"
}

# Cek folder audio
Write-ColorOutput "[1/5] Checking audio directory..." "Yellow"
if (-not (Test-Path $audioDir)) {
    Write-ColorOutput "✗ ERROR: Folder $audioDir tidak ditemukan!" "Red"
    exit 1
}

Write-ColorOutput "✓ Audio directory found" "Green"

# Backup files jika diminta
if ($Backup -and -not $DryRun) {
    Write-ColorOutput "`n[2/5] Creating backup..." "Yellow"
    
    if (Test-Path $backupDir) {
        $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
        $backupDir = ".\public\audio-backup-rename-$timestamp"
    }
    
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    Copy-Item -Path "$audioDir\*.mp3" -Destination $backupDir -Force
    Write-ColorOutput "✓ Backup created at: $backupDir" "Green"
} else {
    Write-ColorOutput "`n[2/5] Skipping backup..." "Gray"
}

# Scan existing files
Write-ColorOutput "`n[3/5] Scanning audio files..." "Yellow"
$existingFiles = Get-ChildItem -Path $audioDir -Filter "*.mp3" | Select-Object -ExpandProperty Name
Write-ColorOutput "✓ Found $($existingFiles.Count) audio files" "Green"

# Preview rename operations
Write-ColorOutput "`n[4/5] Planning rename operations..." "Yellow"

if ($DryRun) {
    Write-ColorOutput "`n  DRY RUN MODE - No files will be modified`n" "Magenta"
}

Write-ColorOutput "  ┌────────────────────────────────────┬────────────────────────────────────┐" "Gray"
Write-ColorOutput "  │ Current Filename                   │ New Filename                       │" "Gray"
Write-ColorOutput "  ├────────────────────────────────────┼────────────────────────────────────┤" "Gray"

$renameCount = 0
$skipCount = 0
$errorCount = 0
$renameOperations = @()

foreach ($oldName in $renameMap.Keys) {
    $newName = $renameMap[$oldName]
    $oldPath = Join-Path $audioDir $oldName
    $newPath = Join-Path $audioDir $newName
    
    $oldNamePadded = $oldName.PadRight(34)
    $newNamePadded = $newName.PadRight(34)
    
    if (Test-Path $oldPath) {
        # File exists, akan di-rename
        Write-ColorOutput "  │ $oldNamePadded │ $newNamePadded │" "White"
        
        if (Test-Path $newPath) {
            Write-ColorOutput "  │   ⚠️ WARNING: Target file already exists!                              │" "Yellow"
            $errorCount++
        } else {
            $renameOperations += @{
                OldPath = $oldPath
                NewPath = $newPath
                OldName = $oldName
                NewName = $newName
            }
            $renameCount++
        }
    } else {
        # File tidak ditemukan
        Write-ColorOutput "  │ $oldNamePadded │ [FILE NOT FOUND - SKIP]            │" "Gray"
        $skipCount++
    }
}

Write-ColorOutput "  └────────────────────────────────────┴────────────────────────────────────┘" "Gray"

# Files yang tidak ada di rename map
Write-ColorOutput "`n  Files not in rename map (will remain unchanged):" "Yellow"
$unmappedFiles = $existingFiles | Where-Object { -not $renameMap.ContainsKey($_) }
if ($unmappedFiles.Count -gt 0) {
    foreach ($file in $unmappedFiles) {
        Write-ColorOutput "    • $file" "Gray"
    }
} else {
    Write-ColorOutput "    (none)" "Gray"
}

# Execute rename operations
if ($renameCount -gt 0 -and -not $DryRun) {
    Write-ColorOutput "`n[5/5] Renaming files..." "Yellow"
    
    $successCount = 0
    foreach ($operation in $renameOperations) {
        try {
            Rename-Item -Path $operation.OldPath -NewName $operation.NewName -ErrorAction Stop
            Write-ColorOutput "  ✓ $($operation.OldName) → $($operation.NewName)" "Green"
            $successCount++
        } catch {
            Write-ColorOutput "  ✗ ERROR: $($operation.OldName) - $($_.Exception.Message)" "Red"
            $errorCount++
        }
    }
    
    Write-ColorOutput "`n✓ Renamed $successCount files successfully" "Green"
    
} elseif ($DryRun) {
    Write-ColorOutput "`n[5/5] Dry run complete - no files modified" "Magenta"
} else {
    Write-ColorOutput "`n[5/5] No files to rename" "Yellow"
}

# Summary
Write-ColorOutput "`n╔════════════════════════════════════════════════════════════╗" "Green"
Write-ColorOutput "║                    SUMMARY                                 ║" "Green"
Write-ColorOutput "╠════════════════════════════════════════════════════════════╣" "Green"
Write-ColorOutput "║  Files to rename: $($renameCount.ToString().PadRight(40)) ║" "Green"
Write-ColorOutput "║  Files skipped (not found): $($skipCount.ToString().PadRight(28)) ║" "Yellow"
Write-ColorOutput "║  Errors/Conflicts: $($errorCount.ToString().PadRight(37)) ║" $(if ($errorCount -gt 0) { "Red" } else { "Green" })
Write-ColorOutput "║  Unmapped files: $($unmappedFiles.Count.ToString().PadRight(39)) ║" "Gray"

if ($Backup -and -not $DryRun) {
    Write-ColorOutput "║  Backup location: $($backupDir.PadRight(36)) ║" "Green"
}

if ($DryRun) {
    Write-ColorOutput "║  Mode: DRY RUN (no files modified)                        ║" "Magenta"
}

Write-ColorOutput "╚════════════════════════════════════════════════════════════╝" "Green"

if ($errorCount -gt 0) {
    Write-ColorOutput "`n⚠️ WARNING: Ada file yang tidak bisa di-rename. Cek output di atas." "Yellow"
}

if ($unmappedFiles.Count -gt 0 -and ($unmappedFiles | Where-Object { $_ -like "narasi cp4*" }).Count -gt 0) {
    Write-ColorOutput "`n📝 NOTE: Chapter 4 narrator files tidak di-rename (sesuai instruksi user)." "Cyan"
    Write-ColorOutput "   Silakan rename manual file-file berikut:" "Cyan"
    $unmappedFiles | Where-Object { $_ -like "narasi cp4*" } | ForEach-Object {
        Write-ColorOutput "   • $_" "White"
    }
}

Write-ColorOutput "`nUsage:" "White"
Write-ColorOutput "  .\rename-audio-files.ps1              # Rename semua file" "Gray"
Write-ColorOutput "  .\rename-audio-files.ps1 -DryRun      # Preview saja, tidak ubah file" "Gray"
Write-ColorOutput "  .\rename-audio-files.ps1 -Backup      # Buat backup sebelum rename" "Gray"

Write-ColorOutput "`n✓ Done!`n" "Green"
