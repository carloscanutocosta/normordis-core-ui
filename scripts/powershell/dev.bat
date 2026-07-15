@echo off
rem Launcher da variante PowerShell.
:: Arranca o servidor Vite para explorar o playground/demo do SDK.
:: O browser abre automaticamente em http://localhost:5173
powershell.exe -ExecutionPolicy Bypass -File "%~dp0dev.ps1" %*
