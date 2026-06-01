# PowerShell script to automatically watch the directory and push to GitHub on save
$folderToWatch = $PSScriptRoot
if ([string]::IsNullOrEmpty($folderToWatch)) {
    $folderToWatch = Get-Location
}

# Create watcher
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $folderToWatch
$watcher.IncludeSubdirectories = $true
$watcher.Filter = "*.*"
$watcher.EnableRaisingEvents = $true

# Track last change timestamp to prevent double triggers on single save events
$global:lastTriggered = [DateTime]::MinValue
$cooldown = [TimeSpan]::FromSeconds(3)

Write-Host "🚀 Watching for changes in: $folderToWatch..." -ForegroundColor Green
Write-Host "✨ Whenever you edit and save any file, it will commit and push automatically." -ForegroundColor Cyan
Write-Host "🛑 Press Ctrl+C in this window to stop watching." -ForegroundColor Yellow

$action = {
    $now = [DateTime]::Now
    # Debounce check
    if (($now - $global:lastTriggered) -lt $cooldown) { return }
    $global:lastTriggered = $now
    
    $changedFile = $eventArgs.Name
    # Ignore git internal files and system files
    if ($changedFile -like "*.git*" -or $changedFile -like "*.stackdump") { return }
    
    Write-Host "`n📝 Change detected: $changedFile" -ForegroundColor Cyan
    Write-Host "⏳ Running git commands..." -ForegroundColor Blue
    
    # Run git commands
    git add .
    git commit -m "Auto-update: saved $changedFile at $(Get-Date -Format 'HH:mm:ss')"
    git push
    
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "🚀 Watching for changes..." -ForegroundColor Green
}

# Register events
$handlers = @()
$handlers += Register-ObjectEvent $watcher "Changed" -Action $action
$handlers += Register-ObjectEvent $watcher "Created" -Action $action
$handlers += Register-ObjectEvent $watcher "Deleted" -Action $action

# Loop to keep active
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    # Cleanup handlers on exit
    foreach ($h in $handlers) {
        Unregister-Event -SourceIdentifier $h.Name -ErrorAction SilentlyContinue
    }
    $watcher.Dispose()
    Write-Host "`n🛑 Auto-push watcher stopped." -ForegroundColor Red
}
