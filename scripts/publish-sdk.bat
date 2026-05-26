@echo off
:: Publica o SDK no GitHub Packages.
:: Requer GITHUB_TOKEN definido como variavel de ambiente.
:: Ver docs\PUBLISHING.md para instrucoes completas.
powershell.exe -ExecutionPolicy Bypass -File "%~dp0publish-sdk.ps1" %*
