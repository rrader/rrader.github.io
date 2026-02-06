# Eye of Sauron - Background Screenshot Monitor
# This script takes screenshots every 1 minute and saves them to Documents/eye_of_sauron

# Load required assemblies for screenshot functionality
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Define the output directory
$outputDir = "$env:USERPROFILE\Documents\eye_of_sauron"

# Create the directory if it doesn't exist
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
    Write-Host "Created directory: $outputDir"
}

Write-Host "Eye of Sauron is watching..."
Write-Host "Screenshots will be saved to: $outputDir"
Write-Host "Taking screenshots every 60 seconds. Press Ctrl+C to stop."
Write-Host ""

# Function to take a screenshot
function Take-Screenshot {
    param (
        [string]$SavePath
    )
    
    try {
        # Get the screen bounds
        $bounds = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
        
        # Create a bitmap with the screen size
        $bitmap = New-Object System.Drawing.Bitmap $bounds.Width, $bounds.Height
        
        # Create a graphics object from the bitmap
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        
        # Copy the screen to the bitmap
        $graphics.CopyFromScreen($bounds.Location, [System.Drawing.Point]::Empty, $bounds.Size)
        
        # Save the screenshot
        $bitmap.Save($SavePath, [System.Drawing.Imaging.ImageFormat]::Png)
        
        # Clean up
        $graphics.Dispose()
        $bitmap.Dispose()
        
        return $true
    }
    catch {
        Write-Host "Error taking screenshot: $_" -ForegroundColor Red
        return $false
    }
}

# Main loop - take screenshots every minute
$counter = 0
while ($true) {
    $counter++
    
    # Generate filename with timestamp
    $timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
    $filename = "screenshot_$timestamp.png"
    $fullPath = Join-Path $outputDir $filename
    
    # Take the screenshot
    $success = Take-Screenshot -SavePath $fullPath
    
    if ($success) {
        $fileSize = (Get-Item $fullPath).Length / 1KB
        Write-Host "[$counter] Screenshot saved: $filename (${fileSize:N2} KB)" -ForegroundColor Green
    }
    
    # Wait for 60 seconds before next screenshot
    Start-Sleep -Seconds 60
}
