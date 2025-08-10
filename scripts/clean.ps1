#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Comprehensive PowerShell cleanup script for The Best Nexus Letters project
.DESCRIPTION
    Removes build directories, cache files, temporary files, and other artifacts
    to free up disk space and ensure clean builds.
.PARAMETER Verbose
    Show detailed output during cleanup
.PARAMETER DryRun
    Preview what would be deleted without actually deleting files
.PARAMETER Deep
    Include package directories like node_modules in cleanup
.PARAMETER Help
    Show help message
.EXAMPLE
    .\scripts\clean.ps1
    Clean build and cache directories
.EXAMPLE
    .\scripts\clean.ps1 -DryRun -Verbose
    Preview cleanup with detailed output
.EXAMPLE
    .\scripts\clean.ps1 -Deep
    Deep clean including node_modules
#>

[CmdletBinding()]
param(
    [Alias('v')]
    [switch]$Verbose,
    
    [Alias('d')]
    [switch]$DryRun,
    
    [switch]$Deep,
    
    [Alias('h')]
    [switch]$Help
)

# Color definitions for cross-platform compatibility
$Colors = @{
    Reset   = "`e[0m"
    Bright  = "`e[1m"
    Dim     = "`e[2m"
    Red     = "`e[31m"
    Green   = "`e[32m"
    Yellow  = "`e[33m"
    Blue    = "`e[34m"
    Magenta = "`e[35m"
    Cyan    = "`e[36m"
}

# Cleanup targets
$CleanupTargets = @{
    BuildDirs = @(
        '.next', 'build', 'dist', 'out', 'site',
        'storybook-static', '.storybook\dist', '.vercel', '.netlify'
    )
    CacheDirs = @(
        'node_modules\.cache', '.cache', '.turbo', '.swc', '.next\cache',
        'coverage', '.nyc_output', '.vitest', 'test-results',
        'playwright-report', 'playwright-results', 'playwright\.cache'
    )
    TempDirs = @(
        'tmp', 'temp', '.tmp', '.temp', 'logs'
    )
    TempFiles = @(
        '*.log', '.DS_Store', 'Thumbs.db', 'desktop.ini'
    )
    PackageDirs = @(
        'node_modules', '.pnpm-store', '.yarn\cache', '.yarn\unplugged',
        '.yarn\build-state.yml', '.yarn\install-state.gz'
    )
    PackageFiles = @(
        'pnpm-lock.yaml.bak', 'yarn-error.log', 'npm-debug.log*', 'yarn-debug.log*'
    )
    DevFiles = @(
        '.env.local.bak', '.env.*.bak', '*.tsbuildinfo', 'tsconfig.tsbuildinfo',
        '.eslintcache', '.stylelintcache', '.prettiercache'
    )
    TestDirs = @(
        'coverage', 'test-results', 'playwright-report', 'playwright-results',
        'allure-results', 'allure-report', 'mochawesome-report', 'jest-coverage',
        '.vitest\coverage'
    )
}

# Global variables
$script:DeletedCount = 0
$script:TotalSize = 0
$script:Errors = @()
$script:ProjectRoot = Get-Location

function Write-ColorLog {
    param(
        [string]$Message,
        [string]$Color = 'Reset',
        [switch]$NoNewline
    )
    
    $colorCode = $Colors[$Color]
    if ($colorCode) {
        if ($NoNewline) {
            Write-Host "$colorCode$Message$($Colors.Reset)" -NoNewline
        } else {
            Write-Host "$colorCode$Message$($Colors.Reset)"
        }
    } else {
        if ($NoNewline) {
            Write-Host $Message -NoNewline
        } else {
            Write-Host $Message
        }
    }
}

function Write-VerboseLog {
    param(
        [string]$Message,
        [string]$Color = 'Dim'
    )
    
    if ($Verbose) {
        Write-ColorLog "  $Message" -Color $Color
    }
}

function Format-Bytes {
    param([long]$Bytes)
    
    if ($Bytes -eq 0) { return '0 B' }
    
    $sizes = @('B', 'KB', 'MB', 'GB', 'TB')
    $order = [Math]::Floor([Math]::Log($Bytes) / [Math]::Log(1024))
    $size = [Math]::Round($Bytes / [Math]::Pow(1024, $order), 2)
    
    return "$size $($sizes[$order])"
}

function Get-DirectorySize {
    param([string]$Path)
    
    try {
        if (Test-Path -Path $Path -PathType Container) {
            $size = (Get-ChildItem -Path $Path -Recurse -Force -ErrorAction SilentlyContinue |
                    Measure-Object -Property Length -Sum).Sum
            return [long]($size -as [long])
        }
        return 0
    }
    catch {
        return 0
    }
}

function Remove-ItemSafely {
    param(
        [string]$Path,
        [string]$DisplayName = $Path
    )
    
    $fullPath = Join-Path $script:ProjectRoot $Path
    
    if (-not (Test-Path -Path $fullPath)) {
        Write-VerboseLog "Skip: $DisplayName (not found)"
        return $false
    }
    
    try {
        $item = Get-Item -Path $fullPath -Force
        $size = 0
        
        if ($item.PSIsContainer) {
            $size = Get-DirectorySize -Path $fullPath
        } else {
            $size = $item.Length
        }
        
        if ($DryRun) {
            Write-ColorLog "[DRY RUN] Would delete: $DisplayName ($(Format-Bytes $size))" -Color 'Yellow'
            $script:TotalSize += $size
            $script:DeletedCount++
            return $true
        }
        
        Remove-Item -Path $fullPath -Recurse -Force -ErrorAction Stop
        Write-ColorLog "Deleted: $DisplayName ($(Format-Bytes $size))" -Color 'Green'
        $script:TotalSize += $size
        $script:DeletedCount++
        return $true
    }
    catch {
        $script:Errors += @{ Path = $DisplayName; Error = $_.Exception.Message }
        Write-ColorLog "Error deleting $DisplayName`: $($_.Exception.Message)" -Color 'Red'
        return $false
    }
}

function Remove-ItemsByPattern {
    param(
        [string[]]$Patterns,
        [string]$Category
    )
    
    foreach ($pattern in $Patterns) {
        try {
            $items = Get-ChildItem -Path $script:ProjectRoot -Filter $pattern -Recurse -Force -ErrorAction SilentlyContinue
            foreach ($item in $items) {
                $relativePath = $item.FullName.Substring($script:ProjectRoot.Path.Length + 1)
                Remove-ItemSafely -Path $relativePath -DisplayName $relativePath
            }
        }
        catch {
            Write-VerboseLog "Error processing pattern '$pattern': $($_.Exception.Message)" -Color 'Red'
        }
    }
}

function Invoke-CleanupCategory {
    param(
        [string]$CategoryName,
        [string[]]$Directories = @(),
        [string[]]$FilePatterns = @()
    )
    
    Write-ColorLog "`n🧹 Cleaning $CategoryName..." -Color 'Cyan'
    
    foreach ($dir in $Directories) {
        Remove-ItemSafely -Path $dir
    }
    
    if ($FilePatterns.Count -gt 0) {
        Remove-ItemsByPattern -Patterns $FilePatterns -Category $CategoryName
    }
}

function Invoke-FullCleanup {
    Write-ColorLog "`n$($Colors.Bright)🚀 Starting cleanup...$($Colors.Reset)" -Color 'Blue'
    
    if ($DryRun) {
        Write-ColorLog "Running in DRY RUN mode - no files will actually be deleted`n" -Color 'Yellow'
    }
    
    # Clean all categories
    Invoke-CleanupCategory -CategoryName "Build directories" -Directories $CleanupTargets.BuildDirs
    Invoke-CleanupCategory -CategoryName "Cache directories" -Directories $CleanupTargets.CacheDirs
    Invoke-CleanupCategory -CategoryName "Temporary directories" -Directories $CleanupTargets.TempDirs
    Invoke-CleanupCategory -CategoryName "Temporary files" -FilePatterns $CleanupTargets.TempFiles
    Invoke-CleanupCategory -CategoryName "Development artifacts" -FilePatterns $CleanupTargets.DevFiles
    Invoke-CleanupCategory -CategoryName "Test artifacts" -Directories $CleanupTargets.TestDirs
    
    # Optional deep cleaning
    if ($Deep) {
        Write-ColorLog "`n⚠️  Deep cleaning package directories..." -Color 'Yellow'
        Invoke-CleanupCategory -CategoryName "Package directories" -Directories $CleanupTargets.PackageDirs
        Invoke-CleanupCategory -CategoryName "Package files" -FilePatterns $CleanupTargets.PackageFiles
    }
}

function Show-Summary {
    Write-ColorLog "`n$($Colors.Bright)📊 Cleanup Summary$($Colors.Reset)" -Color 'Blue'
    Write-ColorLog "Files/directories processed: $script:DeletedCount" -Color 'Green'
    
    $actionText = if ($DryRun) { "that would be " } else { "" }
    Write-ColorLog "Total space ${actionText}freed: $(Format-Bytes $script:TotalSize)" -Color 'Green'
    
    if ($script:Errors.Count -gt 0) {
        Write-ColorLog "`n❌ Errors encountered: $($script:Errors.Count)" -Color 'Red'
        if ($Verbose) {
            foreach ($error in $script:Errors) {
                Write-ColorLog "  $($error.Path): $($error.Error)" -Color 'Red'
            }
        }
    }
    
    if (-not $DryRun -and $script:DeletedCount -eq 0) {
        Write-ColorLog "`n✨ Nothing to clean - your project is already tidy!" -Color 'Green'
    } elseif ($DryRun) {
        Write-ColorLog "`n🔍 Run without -DryRun to actually delete these files" -Color 'Yellow'
    } else {
        Write-ColorLog "`n✅ Cleanup completed successfully!" -Color 'Green'
    }
}

function Show-Help {
    Write-ColorLog @"

$($Colors.Bright)🧹 Project Cleanup Script$($Colors.Reset)

$($Colors.Bright)SYNOPSIS$($Colors.Reset)
    Comprehensive cleanup script for build directories and cache files

$($Colors.Bright)SYNTAX$($Colors.Reset)
    .\scripts\clean.ps1 [-Verbose] [-DryRun] [-Deep] [-Help]

$($Colors.Bright)PARAMETERS$($Colors.Reset)
    -Verbose, -v     Show detailed output during cleanup
    -DryRun, -d      Preview what would be deleted without actually deleting
    -Deep            Include package directories (node_modules, etc.)
    -Help, -h        Show this help message

$($Colors.Bright)EXAMPLES$($Colors.Reset)
    .\scripts\clean.ps1                    # Clean build and cache directories
    .\scripts\clean.ps1 -DryRun            # Preview what would be cleaned
    .\scripts\clean.ps1 -Verbose           # Detailed cleanup output
    .\scripts\clean.ps1 -Deep              # Deep clean including node_modules
    .\scripts\clean.ps1 -DryRun -Verbose   # Verbose dry run

$($Colors.Bright)CATEGORIES CLEANED$($Colors.Reset)
    • Build directories (.next, dist, out, etc.)
    • Cache directories (node_modules\.cache, .turbo, etc.)
    • Temporary files (logs, .DS_Store, etc.)
    • Development artifacts (.eslintcache, *.tsbuildinfo, etc.)
    • Test artifacts (coverage, test-results, etc.)
    • Package directories (-Deep flag required)

"@ -Color 'Cyan'
}

# Main execution
function Main {
    if ($Help) {
        Show-Help
        return
    }
    
    try {
        # Ensure we're in the project root
        $projectRoot = Split-Path -Parent $PSScriptRoot
        Set-Location -Path $projectRoot
        $script:ProjectRoot = Get-Location
        
        Invoke-FullCleanup
        Show-Summary
    }
    catch {
        Write-ColorLog "Fatal error during cleanup: $($_.Exception.Message)" -Color 'Red'
        exit 1
    }
}

# Run the script
Main
