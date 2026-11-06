$html = Get-Content 'd:\Lern App\index.html' -Raw
$js = Get-Content 'd:\Lern App\js\app.js' -Raw
$pattern = 'getElementById\([''"]([^''"]+)[''"]\)'
$regex = New-Object System.Text.RegularExpressions.Regex($pattern)
$matches = $regex.Matches($js)
$missing = @()
foreach ($m in $matches) {
    $id = $m.Groups[1].Value
    $search = 'id="' + $id + '"'
    if (-not $html.Contains($search)) {
        $missing += $id
    }
}
if ($missing.Count -eq 0) {
    Write-Output "VERIFICATION SUCCESS: All element IDs exist!"
} else {
    Write-Output "MISSING IDs:"
    $missing | Select-Object -Unique
}
