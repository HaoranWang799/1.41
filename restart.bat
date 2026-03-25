@echo off
chcp 65001 >nul
echo 正在关闭所有 node 进程...
taskkill /f /im node.exe 2>nul
echo 已清理完毕。
echo.
echo 3秒后自动启动项目...
timeout /t 3 /nobreak >nul
call "%~dp0start.bat"
