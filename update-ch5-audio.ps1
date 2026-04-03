# PowerShell script untuk bulk update Chapter 5 audio mapping
$file = "D:\PSAJ\EMTEKA X PEKAEN\suara-yang-didengar\data\chapter-5.ts"
$content = Get-Content $file -Raw

# Array of scene IDs yang perlu tense music (konflik, presentasi, debat)
$tenseScenes = @(
    "ch5_pak_heru_1", "ch5_pak_heru_2", "ch5_bayu_1", "ch5_bayu_2",
    "ch5_pak_darma_1", "ch5_mbah_darmo_1", "ch5_laras_1", "ch5_laras_2",
    "ch5_a_pak_heru", "ch5_a_pak_darma", "ch5_a_pak_bakri", "ch5_a_bayu",
    "ch5_b_pak_heru", "ch5_b_pak_darma", "ch5_b_laras", "ch5_b_ibu_ratna", "ch5_b_bayu"
)

# Array of scene IDs yang perlu calm music (konklusi, farewell)
$calmScenes = @(
    "ch5_konklusi", "ch5_farewell_mbah", "ch5_farewell_aris", 
    "ch5_farewell_laras", "ch5_the_end"
)

# Add tense background music
foreach ($scene in $tenseScenes) {
    # Pattern: find closing of scene object, add backgroundMusic before closing brace
    $pattern = "(id: `"$scene`",[\s\S]*?nextSceneId: `"[^`"]*`")"
    $replacement = "`$1,`n        backgroundMusic: `"tense`""
    $content = $content -replace $pattern, $replacement
}

# Add calm background music
foreach ($scene in $calmScenes) {
    $pattern = "(id: `"$scene`",[\s\S]*?nextSceneId: `"[^`"]*`")"
    $replacement = "`$1,`n        backgroundMusic: `"calm`""
    $content = $content -replace $pattern, $replacement
}

# Add narrator to conclusion scene
$content = $content -replace "(id: `"ch5_the_end`",[\s\S]*?backgroundMusic: `"calm`")", "`$1,`n        narratorAudio: `"narrator-ch5-conclusion.mp3`""

# Save updated content
Set-Content -Path $file -Value $content -NoNewline

Write-Host "✅ Chapter 5 audio mapping updated successfully!" -ForegroundColor Green
