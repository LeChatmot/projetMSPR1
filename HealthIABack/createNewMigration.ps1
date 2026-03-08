# Récupère tous les fichiers de migration
$schemaDir = Join-Path $PSScriptRoot "schema"
$files = Get-ChildItem -Path $schemaDir -Filter "V*.sql" -File

$versions = @()

foreach ($file in $files) {
    if ($file.Name -match '^V(\d+)_(\d+)__.*\.sql$') {
        $versions += [PSCustomObject]@{
            Major = [int]$matches[1]
            Minor = [int]$matches[2]
        }
    }
}

if ($versions.Count -eq 0) {
    Write-Host "Aucune migration trouvee. Version de depart = 1_00"
    $major = 1
    $minor = 0
}
else {
    $last = $versions |
        Sort-Object Major, Minor |
        Select-Object -Last 1

    $major = $last.Major
    $minor = $last.Minor
}

# Incrementation automatique du minor
$minor++

$version = "{0}_{1:00}" -f $major, $minor

Write-Host "Derniere version detectee -> $($major)_$("{0:00}" -f ($minor-1))"
Write-Host "Nouvelle version -> $version"

$description = "XXXXXXXXXXXX"

# Nettoyage de la description
$description = $description.Trim()
$description = $description -replace '\s+', '_'
$description = $description -replace '[^a-zA-Z0-9_]', ''

$filename = "V$version" + "__" + "$description.sql"
$filepath = Join-Path $schemaDir $filename

New-Item -ItemType File -Path $filepath | Out-Null

Write-Host "Fichier cree : $filepath"