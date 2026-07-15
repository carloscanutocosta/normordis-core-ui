@echo off
rem Launcher da variante PowerShell.
powershell.exe -ExecutionPolicy Bypass -File "%~dp0build-release.ps1" %*
