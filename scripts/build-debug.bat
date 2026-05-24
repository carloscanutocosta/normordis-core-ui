@echo off
powershell.exe -ExecutionPolicy Bypass -File "%~dp0build-debug.ps1" %*
