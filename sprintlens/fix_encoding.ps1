$filePath = "src\app\(app)\dashboard\page.tsx"
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

# Fix common UTF-8 text that was mis-read as Windows-1252 and re-encoded
# bullet: U+2022 -> corrupted as â€¢
$content = $content -replace [regex]::Escape("â€¢"), "•"
# right arrow: U+2192 -> corrupted as â†'
$content = $content -replace [regex]::Escape("â†'"), "→"
# em dash: U+2014 -> corrupted as â€"
$content = $content -replace [regex]::Escape("â€""), "—"
# en dash: U+2013 -> corrupted as â€"
$content = $content -replace [regex]::Escape("â€""), "–"
# right single quote: U+2019 -> corrupted as â€™
$content = $content -replace [regex]::Escape("â€™"), "'"
# left double quote: U+201C -> corrupted as â€œ
$content = $content -replace [regex]::Escape("â€œ"), '"'
# right double quote: U+201D -> corrupted as â€
$content = $content -replace [regex]::Escape("â€"), '"'

[System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
Write-Host "Encoding fix complete. Characters restored."
