# =============================================================================
# Vercel Environment Variables Setup Script
# Run this ONCE after `npx vercel login` to push all required env vars to Vercel
# =============================================================================

Write-Host "Setting up Vercel environment variables for Test Orchestrator..." -ForegroundColor Cyan

# Load local .env values
$envFile = Join-Path $PSScriptRoot "backend\.env"
$envVars = @{}
Get-Content $envFile | ForEach-Object {
    if ($_ -match '^([^#=]+)=(.*)$') {
        $key   = $Matches[1].Trim().Trim('"')
        $value = $Matches[2].Trim().Trim('"')
        $envVars[$key] = $value
    }
}

# Generate a stable ENCRYPTION_KEY if not present
if (-not $envVars["ENCRYPTION_KEY"]) {
    $bytes = New-Object byte[] 32
    [System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
    $envVars["ENCRYPTION_KEY"] = [System.BitConverter]::ToString($bytes).Replace("-","").ToLower().Substring(0, 32)
    Write-Host "Generated new ENCRYPTION_KEY: $($envVars['ENCRYPTION_KEY'])" -ForegroundColor Yellow
    Write-Host "IMPORTANT: Save this key! Add it to your backend\.env as ENCRYPTION_KEY=<value>" -ForegroundColor Red
}

# Required variables for production
$required = @("POSTGRES_URL", "JWT_SECRET", "ENCRYPTION_KEY")

foreach ($key in $required) {
    $value = $envVars[$key]
    if (-not $value) {
        Write-Host "ERROR: $key is missing from backend\.env — skipping." -ForegroundColor Red
        continue
    }
    Write-Host "Setting $key ..." -ForegroundColor Green
    # Set for all environments (production, preview, development)
    $value | npx vercel env add $key production --force 2>&1 | Out-Null
    Write-Host "  ✅ $key set for production" -ForegroundColor Green
}

Write-Host ""
Write-Host "Done! Now run: npx vercel --prod" -ForegroundColor Cyan
Write-Host "Then test registration on your live URL." -ForegroundColor Cyan
