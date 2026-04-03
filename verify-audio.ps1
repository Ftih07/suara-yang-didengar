# ============================================================================
# Script: verify-audio.ps1
# Deskripsi: Verifikasi integritas audio system
# ============================================================================

param([switch]$Detailed)

$ErrorActionPreference = "Continue"
$audioDir = ".\public\audio"

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

# Header
Write-ColorOutput "`n╔════════════════════════════════════════════════════════════╗" "Cyan"
Write-ColorOutput "║         AUDIO VERIFICATION SCRIPT v1.0                    ║" "Cyan"
Write-ColorOutput "║         Suara Yang Didengar - Audio Health Check         ║" "Cyan"
Write-ColorOutput "╚════════════════════════════════════════════════════════════╝`n" "Cyan"

# Expected files
$expectedBgMusic = @("bg-menu.mp3", "bg-calm.mp3", "bg-tense.mp3")
$expectedNarrator = @(
    "narrator-ch1-intro.mp3", "narrator-ch1-conclusion.mp3",
    "narrator-ch2-intro.mp3", "narrator-ch2-conclusion.mp3",
    "narrator-ch3-intro.mp3", "narrator-ch3-conclusion.mp3",
    "narrator-ch4-intro.mp3", "narrator-ch4-conclusion.mp3",
    "narrator-ch5-intro.mp3", "narrator-ch5-conclusion.mp3"
)

$totalExpected = $expectedBgMusic.Count + $expectedNarrator.Count
$foundCount = 0
$missingCount = 0
$issuesList = @()

# Check directory
Write-ColorOutput "[1/4] Checking audio directory..." "Yellow"
if (-not (Test-Path $audioDir)) {
    Write-ColorOutput "✗ ERROR: Folder $audioDir tidak ditemukan!" "Red"
    exit 1
}
Write-ColorOutput "✓ Audio directory found" "Green"

# Verify background music
Write-ColorOutput "`n[2/4] Verifying background music..." "Yellow"
foreach ($file in $expectedBgMusic) {
    $filePath = Join-Path $audioDir $file
    if (Test-Path $filePath) {
        $size = [math]::Round((Get-Item $filePath).Length / 1KB, 1)
        Write-ColorOutput "  ✓ $file ($size KB)" "Green"
        $foundCount++
    } else {
        Write-ColorOutput "  ✗ MISSING: $file" "Red"
        $missingCount++
        $issuesList += "Missing: $file"
    }
}

# Verify narrator audio
Write-ColorOutput "`n[3/4] Verifying narrator audio..." "Yellow"
foreach ($file in $expectedNarrator) {
    $filePath = Join-Path $audioDir $file
    if (Test-Path $filePath) {
        $size = [math]::Round((Get-Item $filePath).Length / 1KB, 1)
        Write-ColorOutput "  ✓ $file ($size KB)" "Green"
        $foundCount++
    } else {
        Write-ColorOutput "  ✗ MISSING: $file" "Red"
        $missingCount++
        $issuesList += "Missing: $file"
    }
}

# Check extra files
Write-ColorOutput "`n[4/4] Checking for extra files..." "Yellow"
$allExpected = $expectedBgMusic + $expectedNarrator
$existingFiles = Get-ChildItem -Path $audioDir -Filter "*.mp3" | Select-Object -ExpandProperty Name
$extraFiles = $existingFiles | Where-Object { $allExpected -notcontains $_ }

if ($extraFiles.Count -gt 0) {
    Write-ColorOutput "  Found $($extraFiles.Count) unmapped files:" "Yellow"
    foreach ($file in $extraFiles) {
        $size = [math]::Round((Get-Item (Join-Path $audioDir $file)).Length / 1KB, 1)
        Write-ColorOutput "    • $file ($size KB)" "Yellow"
    }
} else {
    Write-ColorOutput "  ✓ No extra files" "Green"
}

# Summary
Write-ColorOutput "`n╔════════════════════════════════════════════════════════════╗" "Cyan"
Write-ColorOutput "║                    SUMMARY                                 ║" "Cyan"
Write-ColorOutput "╠════════════════════════════════════════════════════════════╣" "Cyan"
Write-ColorOutput "║  Total expected: $totalExpected                                           ║" "White"
Write-ColorOutput "║  Files found: $foundCount                                              ║" $(if ($foundCount -eq $totalExpected) { "Green" } else { "Yellow" })
Write-ColorOutput "║  Files missing: $missingCount                                            ║" $(if ($missingCount -gt 0) { "Red" } else { "Green" })
Write-ColorOutput "║  Extra files: $($extraFiles.Count)                                              ║" $(if ($extraFiles.Count -gt 0) { "Yellow" } else { "Green" })
Write-ColorOutput "╚════════════════════════════════════════════════════════════╝" "Cyan"

if ($missingCount -eq 0) {
    Write-ColorOutput "`n✓ AUDIO SYSTEM HEALTHY!`n" "Green"
    exit 0
} else {
    Write-ColorOutput "`n⚠️ ISSUES DETECTED:" "Yellow"
    foreach ($issue in $issuesList) {
        Write-ColorOutput "  • $issue" "Yellow"
    }
    Write-ColorOutput "`nRECOMMENDATION:" "Cyan"
    Write-ColorOutput "  Jalankan: .\rename-audio-files.ps1 -Backup" "White"
    Write-ColorOutput "`n" "White"
    exit 1
}
