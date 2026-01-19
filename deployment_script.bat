@echo off
echo Starting Deployment Setup...

:: Kill node processes just in case
taskkill /F /IM node.exe >nul 2>&1

echo Initializing Git...
git init

echo Adding files (this might take a moment)...
git add .

echo Committing changes...
git commit -m "Deploy v1"

echo Renaming branch to main...
git branch -M main

echo Adding remote origin (ignoring error if exists)...
git remote add origin https://github.com/khamis2/sahib-app.git
git remote set-url origin https://github.com/khamis2/sahib-app.git

echo Pushing to GitHub...
echo (You may be asked to sign in in your browser)
git push -u origin main

echo.
echo Deployment Script Finished!
echo If you saw green success text, go to Vercel/Render!
echo.
pause
