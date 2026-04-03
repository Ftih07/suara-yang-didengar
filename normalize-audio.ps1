# ============================================================================
# Script: normalize-audio.ps1
# Deskripsi: Normalisasi volume semua file audio di folder public/audio/
# Requirement: ffmpeg harus terinstall dan ada di PATH
# ============================================================================

param(
    [switch]$DryRun,  # Mode preview tanpa mengubah file
    [switch]$Backup   # Buat backup sebelum normalisasi
)

$ErrorActionPreference = "Stop"
$audioDir = ".\public\audio"
$backupDir = ".\public\audio-backup"

# Warna untuk output
function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

# Header
Write-ColorOutput "`n╔════════════════════════════════════════════════════════════╗" "Cyan"
Write-ColorOutput "║         AUDIO NORMALIZATION SCRIPT v1.0                   ║" "Cyan"
Write-ColorOutput "║         Suara Yang Didengar - Audio Normalizer           ║" "Cyan"
Write-ColorOutput "╚════════════════════════════════════════════════════════════╝`n" "Cyan"

# Cek apakah ffmpeg terinstall
Write-ColorOutput "[1/6] Checking ffmpeg installation..." "Yellow"
try {
    $ffmpegVersion = & ffmpeg -version 2>&1 | Select-Object -First 1
    Write-ColorOutput "✓ ffmpeg found: $ffmpegVersion" "Green"
} catch {
    Write-ColorOutput "✗ ERROR: ffmpeg tidak ditemukan!" "Red"
    Write-ColorOutput "  Install ffmpeg terlebih dahulu: https://ffmpeg.org/download.html" "Red"
    exit 1
}

# Cek folder audio
Write-ColorOutput "`n[2/6] Checking audio directory..." "Yellow"
if (-not (Test-Path $audioDir)) {
    Write-ColorOutput "✗ ERROR: Folder $audioDir tidak ditemukan!" "Red"
    exit 1
}

$audioFiles = Get-ChildItem -Path $audioDir -Filter "*.mp3"
Write-ColorOutput "✓ Found $($audioFiles.Count) audio files" "Green"

if ($audioFiles.Count -eq 0) {
    Write-ColorOutput "  No audio files to process. Exiting." "Yellow"
    exit 0
}

# Backup files jika diminta
if ($Backup -and -not $DryRun) {
    Write-ColorOutput "`n[3/6] Creating backup..." "Yellow"
    
    if (Test-Path $backupDir) {
        $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
        $backupDir = ".\public\audio-backup-$timestamp"
    }
    
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    Copy-Item -Path "$audioDir\*.mp3" -Destination $backupDir -Force
    Write-ColorOutput "✓ Backup created at: $backupDir" "Green"
} else {
    Write-ColorOutput "`n[3/6] Skipping backup..." "Gray"
}

# Analisa volume saat ini
Write-ColorOutput "`n[4/6] Analyzing current audio levels..." "Yellow"
$analysisResults = @()

foreach ($file in $audioFiles) {
    $filename = $file.Name
    Write-Host "  Analyzing: $filename..." -NoNewline
    
    # Jalankan ffmpeg untuk analisa loudness (gunakan loudnorm filter)
    $output = & ffmpeg -i "$($file.FullName)" -af "loudnorm=print_format=json" -f null - 2>&1 | Out-String
    
    # Parse JSON output dari loudnorm
    if ($output -match '\{[\s\S]*"input_i"\s*:\s*"([^"]+)"[\s\S]*"input_lra"\s*:\s*"([^"]+)"[\s\S]*"input_tp"\s*:\s*"([^"]+)"[\s\S]*\}') {
        $inputI = [math]::Round([double]$matches[1], 2)
        $inputLRA = [math]::Round([double]$matches[2], 2)
        $inputTP = [math]::Round([double]$matches[3], 2)
        
        $analysisResults += [PSCustomObject]@{
            Filename = $filename
            CurrentLoudness = $inputI
            LRA = $inputLRA
            TruePeak = $inputTP
        }
        
        Write-Host " LUFS: $inputI" -ForegroundColor Cyan
    } else {
        Write-Host " ERROR" -ForegroundColor Red
    }
}

# Tampilkan hasil analisa
Write-ColorOutput "`n  Analysis Results:" "White"
Write-ColorOutput "  ┌────────────────────────────────────────┬────────────┬──────┬──────────┐" "Gray"
Write-ColorOutput "  │ Filename                               │ Loudness   │ LRA  │ TruePeak │" "Gray"
Write-ColorOutput "  ├────────────────────────────────────────┼────────────┼──────┼──────────┤" "Gray"
foreach ($result in $analysisResults) {
    $fname = $result.Filename.PadRight(38)
    $loud = "$($result.CurrentLoudness) LUFS".PadRight(10)
    $lra = "$($result.LRA)".PadRight(4)
    $tp = "$($result.TruePeak)".PadRight(8)
    Write-ColorOutput "  │ $fname │ $loud │ $lra │ $tp │" "White"
}
Write-ColorOutput "  └────────────────────────────────────────┴────────────┴──────┴──────────┘" "Gray"

# Normalisasi audio files
Write-ColorOutput "`n[5/6] Normalizing audio files..." "Yellow"

# Target levels
$targetBgMusic = -18.0    # Background music: -18 LUFS (lebih pelan)
$targetNarrator = -16.0   # Narrator: -16 LUFS (lebih keras dari BG)

if ($DryRun) {
    Write-ColorOutput "  DRY RUN MODE - No files will be modified" "Magenta"
}

foreach ($file in $audioFiles) {
    $filename = $file.Name
    
    # Tentukan target berdasarkan nama file
    $target = if ($filename -like "*bgsnd*" -or $filename -like "*bg-*") { 
        $targetBgMusic 
    } else { 
        $targetNarrator 
    }
    
    $typeLabel = if ($target -eq $targetBgMusic) { "BG Music" } else { "Narrator" }
    
    Write-Host "  Processing: $filename ($typeLabel, target: $target LUFS)..." -NoNewline
    
    if ($DryRun) {
        Write-Host " [DRY RUN - SKIPPED]" -ForegroundColor Magenta
        continue
    }
    
    # Buat temporary file
    $tempFile = "$($file.DirectoryName)\temp_$($file.Name)"
    
    # Jalankan ffmpeg dengan loudnorm filter (two-pass normalization)
    # Pass 1: Analisa
    $pass1 = & ffmpeg -i "$($file.FullName)" -af "loudnorm=I=$target:TP=-1.5:LRA=11:print_format=json" -f null - 2>&1 | Out-String
    
    # Parse hasil pass 1
    if ($pass1 -match '\{[\s\S]*"input_i"\s*:\s*"([^"]+)"[\s\S]*"input_tp"\s*:\s*"([^"]+)"[\s\S]*"input_lra"\s*:\s*"([^"]+)"[\s\S]*"input_thresh"\s*:\s*"([^"]+)"[\s\S]*"target_offset"\s*:\s*"([^"]+)"[\s\S]*\}') {
        $measured_I = $matches[1]
        $measured_TP = $matches[2]
        $measured_LRA = $matches[3]
        $measured_thresh = $matches[4]
        $offset = $matches[5]
        
        # Pass 2: Normalisasi dengan parameter dari pass 1
        $filterComplex = "loudnorm=I=$target`:TP=-1.5`:LRA=11`:measured_I=$measured_I`:measured_LRA=$measured_LRA`:measured_TP=$measured_TP`:measured_thresh=$measured_thresh`:offset=$offset`:linear=true`:print_format=summary"
        
        $result = & ffmpeg -i "$($file.FullName)" -af $filterComplex -ar 44100 -b:a 192k "$tempFile" -y 2>&1
        
        if ($LASTEXITCODE -eq 0 -and (Test-Path $tempFile)) {
            # Replace original dengan normalized file
            Move-Item -Path $tempFile -Destination $file.FullName -Force
            Write-Host " DONE" -ForegroundColor Green
        } else {
            Write-Host " ERROR" -ForegroundColor Red
            if (Test-Path $tempFile) { Remove-Item $tempFile }
        }
    } else {
        Write-Host " ERROR (analysis failed)" -ForegroundColor Red
    }
}

# Summary
Write-ColorOutput "`n[6/6] Normalization complete!" "Yellow"
Write-ColorOutput "`n╔════════════════════════════════════════════════════════════╗" "Green"
Write-ColorOutput "║                    SUMMARY                                 ║" "Green"
Write-ColorOutput "╠════════════════════════════════════════════════════════════╣" "Green"
Write-ColorOutput "║  Total files processed: $($audioFiles.Count.ToString().PadRight(32)) ║" "Green"

if ($Backup -and -not $DryRun) {
    Write-ColorOutput "║  Backup location: $($backupDir.PadRight(36)) ║" "Green"
}

if ($DryRun) {
    Write-ColorOutput "║  Mode: DRY RUN (no files modified)                        ║" "Magenta"
}

Write-ColorOutput "╚════════════════════════════════════════════════════════════╝" "Green"

Write-ColorOutput "`nTarget Levels:" "White"
Write-ColorOutput "  • Background Music: $targetBgMusic LUFS" "Cyan"
Write-ColorOutput "  • Narrator Audio: $targetNarrator LUFS" "Cyan"

Write-ColorOutput "`nUsage:" "White"
Write-ColorOutput "  .\normalize-audio.ps1              # Normalisasi semua file" "Gray"
Write-ColorOutput "  .\normalize-audio.ps1 -DryRun      # Preview saja, tidak ubah file" "Gray"
Write-ColorOutput "  .\normalize-audio.ps1 -Backup      # Buat backup sebelum normalisasi" "Gray"

Write-ColorOutput "`n✓ Done!`n" "Green"
