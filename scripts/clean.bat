@echo off
:: Windows batch wrapper for the cleanup script
:: Usage: clean.bat [options]

setlocal

:: Set the script directory
set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%SCRIPT_DIR%.."

:: Change to project root
pushd "%PROJECT_ROOT%"

:: Check if Node.js is available
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    exit /b 1
)

:: Run the cleanup script with all arguments
node "%SCRIPT_DIR%clean.js" %*

:: Store the exit code
set "EXIT_CODE=%ERRORLEVEL%"

:: Return to original directory
popd

:: Exit with the same code as the Node.js script
exit /b %EXIT_CODE%
