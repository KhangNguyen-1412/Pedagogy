Add-Type -AssemblyName System.Drawing

$srcPath = Join-Path $PSScriptRoot "..\src\assets\logo.png"
$publicDir = Join-Path $PSScriptRoot "..\public"

$srcBmp = [System.Drawing.Bitmap]::new($srcPath)
Write-Host "Source image size: $($srcBmp.Width) x $($srcBmp.Height)"

# Function to resize with high quality
function Resize-Image {
    param(
        [System.Drawing.Bitmap]$source,
        [int]$width,
        [int]$height,
        [string]$outputPath,
        [int]$paddingPercent = 0
    )

    $targetBmp = [System.Drawing.Bitmap]::new($width, $height)
    $g = [System.Drawing.Graphics]::FromImage($targetBmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)

    if ($paddingPercent -gt 0) {
        $padX = [int]($width * $paddingPercent / 100)
        $padY = [int]($height * $paddingPercent / 100)
        $destW = $width - ($padX * 2)
        $destH = $height - ($padY * 2)
        $destRect = [System.Drawing.Rectangle]::new($padX, $padY, $destW, $destH)
    } else {
        $destRect = [System.Drawing.Rectangle]::new(0, 0, $width, $height)
    }

    $g.DrawImage($source, $destRect)
    $g.Dispose()

    $targetBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $targetBmp.Dispose()
    Write-Host "Generated: $outputPath ($width x $height)"
}

# 1. Standard Apple Touch Icon for iOS (180x180)
Resize-Image -source $srcBmp -width 180 -height 180 -outputPath (Join-Path $publicDir "apple-touch-icon.png")

# 2. PWA Icon 192x192 (Android / Desktop)
Resize-Image -source $srcBmp -width 192 -height 192 -outputPath (Join-Path $publicDir "icon-192.png")

# 3. PWA Icon 512x512 (Android / Desktop Splash)
Resize-Image -source $srcBmp -width 512 -height 512 -outputPath (Join-Path $publicDir "icon-512.png")

# 4. Maskable PWA Icon 192x192 & 512x512 (with 10% padding for Android adaptive icon safe zone)
Resize-Image -source $srcBmp -width 192 -height 192 -outputPath (Join-Path $publicDir "icon-192-maskable.png") -paddingPercent 10
Resize-Image -source $srcBmp -width 512 -height 512 -outputPath (Join-Path $publicDir "icon-512-maskable.png") -paddingPercent 10

# 5. Favicons
Resize-Image -source $srcBmp -width 32 -height 32 -outputPath (Join-Path $publicDir "favicon-32x32.png")
Resize-Image -source $srcBmp -width 16 -height 16 -outputPath (Join-Path $publicDir "favicon-16x16.png")

# 6. Copy full size logo to public/logo.png
Copy-Item $srcPath (Join-Path $publicDir "logo.png") -Force
Write-Host "Copied logo.png to public/logo.png"

$srcBmp.Dispose()
Write-Host "All icons generated successfully!"
