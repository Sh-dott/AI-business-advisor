# Quick script to deploy backend to Render.com (Windows PowerShell)
# Usage: .\deploy-to-render.ps1 [deploy-hook-url]

param(
    [string]$DeployHook = ""
)

Write-Host "═══════════════════════════════════════" -ForegroundColor Yellow
Write-Host "   Render.com Deployment Script" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════" -ForegroundColor Yellow
Write-Host ""

# Check if deploy hook URL is provided as argument
if ($DeployHook) {
    Write-Host "✓ Using deploy hook from argument" -ForegroundColor Green
}
# Check if deploy hook is in .env file
elseif (Test-Path .env) {
    $envContent = Get-Content .env
    $hookLine = $envContent | Where-Object { $_ -match "RENDER_DEPLOY_HOOK" }
    if ($hookLine) {
        $DeployHook = ($hookLine -split '=', 2)[1].Trim()
        Write-Host "✓ Using deploy hook from .env file" -ForegroundColor Green
    }
}

# If still no deploy hook found, show instructions
if (-not $DeployHook) {
    Write-Host "✗ No deploy hook found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please provide your Render deploy hook URL either:"
    Write-Host "  1. As an argument: .\deploy-to-render.ps1 https://api.render.com/deploy/srv-xxxxx?key=yyyyy"
    Write-Host "  2. In .env file: RENDER_DEPLOY_HOOK=https://api.render.com/deploy/srv-xxxxx?key=yyyyy"
    Write-Host ""
    Write-Host "To get your deploy hook:"
    Write-Host "  1. Go to https://dashboard.render.com/"
    Write-Host "  2. Select your backend service"
    Write-Host "  3. Go to Settings → Deploy Hook"
    Write-Host "  4. Click 'Create Deploy Hook'"
    Write-Host ""

    # Offer to open Render dashboard
    $openDashboard = Read-Host "Would you like to open Render dashboard now? (y/n)"
    if ($openDashboard -eq 'y') {
        Start-Process "https://dashboard.render.com/"
    }
    exit 1
}

# Trigger deployment
Write-Host ""
Write-Host "Triggering deployment..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri $DeployHook -Method POST -UseBasicParsing

    Write-Host "✓ Deployment triggered successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Deployment is now in progress. This usually takes 2-3 minutes." -ForegroundColor Cyan
    Write-Host "Check status at: https://dashboard.render.com/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Green
    Write-Host "  1. Wait for deployment to complete"
    Write-Host "  2. Test at: https://sh-dott.github.io/AI-business-advisor/"
    Write-Host "  3. Try downloading a document in different languages"
    Write-Host ""

    # Offer to open the app
    $openApp = Read-Host "Would you like to open the app now? (y/n)"
    if ($openApp -eq 'y') {
        Start-Process "https://sh-dott.github.io/AI-business-advisor/"
    }
}
catch {
    Write-Host "✗ Deployment might have failed" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check:"
    Write-Host "  1. Your deploy hook URL is correct"
    Write-Host "  2. The service exists on Render.com"
    Write-Host "  3. Try manual deploy: https://dashboard.render.com/"
}
