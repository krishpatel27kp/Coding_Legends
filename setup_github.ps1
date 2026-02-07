# GitHub Setup Script for DataPulse
# This script initializes the git repository and pushes to GitHub.

Write-Host "Initializing Git Repository..." -ForegroundColor Cyan
if (-not (Test-Path ".git")) {
    git init
    if ($LASTEXITCODE -ne 0) { Write-Error "Failed to initialize git repository."; exit }
}
else {
    Write-Host "Git repository already initialized." -ForegroundColor Yellow
}

Write-Host "Adding files..." -ForegroundColor Cyan
git add .

Write-Host "Committing files..." -ForegroundColor Cyan
git commit -m "Initial commit: DataPulse with Midnight Aurora theme"

Write-Host "Rename branch to main..." -ForegroundColor Cyan
git branch -M main

# Check if GitHub CLI is installed
if (Get-Command gh -ErrorAction SilentlyContinue) {
    $useGh = Read-Host "GitHub CLI (gh) detected. Do you want to create the repo automatically? (Y/N)"
    if ($useGh -eq 'Y' -or $useGh -eq 'y') {
        Write-Host "Creating GitHub repository..." -ForegroundColor Cyan
        gh repo create DataPulse --public --source=. --remote=origin --push
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Repository created and pushed successfully!" -ForegroundColor Green
            exit
        }
    }
}

# Fallback to manual remote adding
$repoUrl = Read-Host "Enter your GitHub Repository URL (e.g., https://github.com/username/DataPulse.git)"

if (-not [string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "Adding remote origin..." -ForegroundColor Cyan
    if (git remote get-url origin 2>$null) {
        git remote set-url origin $repoUrl
    }
    else {
        git remote add origin $repoUrl
    }
    
    Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Successfully pushed to GitHub!" -ForegroundColor Green
    }
    else {
        Write-Error "Failed to push to GitHub. Please check your URL and credentials."
    }
}
else {
    Write-Host "No URL provided. Repository initialized locally." -ForegroundColor Yellow
    Write-Host "Run 'git remote add origin <URL>' and 'git push -u origin main' later."
}
