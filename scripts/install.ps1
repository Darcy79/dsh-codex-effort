#Requires -Version 5.1
<#
.SYNOPSIS
  Install dsh-codex-effort into a DeepSeek Harness profile.

.DESCRIPTION
  Uses the `dsh` CLI when it is on PATH. Otherwise it finds the running
  DeepSeek Harness desktop executable, runs its bundled CLI in Electron's Node
  mode, and wires the bundled pnpm into PATH when needed.

  The plugin is linked from this checkout, so rebuilding lib/client.js is
  enough for the next Harness start to pick the new bundle up.

.PARAMETER Profile
  Target DSH profile. Defaults to `desktop`.

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File .\scripts\install.ps1
#>
[CmdletBinding()]
param(
  [string]$Profile = 'desktop'
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$dshHome = if ($env:DSH_HOME) { $env:DSH_HOME } else { Join-Path $env:USERPROFILE '.dsh' }

if ($Profile -eq 'desktop') {
  Write-Host 'The desktop profile is owned by the DeepSeek Harness application.' -ForegroundColor Yellow
  Write-Host 'Install this folder from the app:'
  Write-Host ''
  Write-Host '  1. Open Plugins in the left sidebar.'
  Write-Host '  2. Click Add plugin (top right).'
  Write-Host '  3. Paste this path into the package-or-address field:'
  Write-Host "     $root"
  Write-Host '  4. Click Install, enable the plugin, then restart DeepSeek Harness.'
  Write-Host ''
  Write-Host 'For a CLI/web profile instead, run:'
  Write-Host "  powershell -ExecutionPolicy Bypass -File `"$PSCommandPath`" -Profile web"
  return
}

function Find-DesktopApp {
  if ($env:DSH_DESKTOP_EXE -and (Test-Path $env:DSH_DESKTOP_EXE)) {
    return $env:DSH_DESKTOP_EXE
  }

  $running = Get-Process -Name 'DeepSeek Harness' -ErrorAction SilentlyContinue |
    Where-Object { $_.Path } |
    Select-Object -First 1
  if ($running) { return $running.Path }

  $candidates = @(
    (Join-Path $env:LOCALAPPDATA 'Programs\DeepSeek Harness\DeepSeek Harness.exe'),
    (Join-Path $env:LOCALAPPDATA 'DeepSeek Harness\DeepSeek Harness.exe'),
    (Join-Path $env:ProgramFiles 'DeepSeek Harness\DeepSeek Harness.exe'),
    (Join-Path ${env:ProgramFiles(x86)} 'DeepSeek Harness\DeepSeek Harness.exe')
  )
  foreach ($candidate in $candidates) {
    if ($candidate -and (Test-Path $candidate)) { return $candidate }
  }
  return $null
}

function Ensure-Pnpm {
  $command = Get-Command pnpm -ErrorAction SilentlyContinue
  if ($command) { return }

  $runtimeRoots = @(
    (Join-Path $dshHome 'dsh-runtimes\dsh-primary-runtime\dependencies'),
    (Join-Path $dshHome 'dsh-runtimes\dsh-web-runtime\dependencies')
  )
  $app = Find-DesktopApp
  if ($app) {
    $runtimeRoots += (Join-Path (Split-Path $app) 'resources\runtime\primary-runtime\dependencies')
  }

  foreach ($runtime in $runtimeRoots) {
    $node = Join-Path $runtime 'node\bin\node.exe'
    $pnpm = Join-Path $runtime 'pnpm\bin\pnpm.cjs'
    if (-not (Test-Path $node) -or -not (Test-Path $pnpm)) { continue }

    $shimDir = Join-Path $env:TEMP 'dsh-codex-effort\bin'
    New-Item -ItemType Directory -Force $shimDir | Out-Null
    $shim = Join-Path $shimDir 'pnpm.cmd'
    $content = "@echo off`r`n`"$node`" `"$pnpm`" %*`r`n"
    [System.IO.File]::WriteAllText($shim, $content, [System.Text.Encoding]::ASCII)
    $env:PATH = "$shimDir;$env:PATH"
    return
  }

  throw 'pnpm was not found on PATH and no bundled pnpm could be located.'
}

$app = Find-DesktopApp
$dshCommand = Get-Command dsh -ErrorAction SilentlyContinue

if (-not $dshCommand -and -not $app) {
  throw 'Could not find the dsh CLI or the DeepSeek Harness desktop application.'
}

Ensure-Pnpm

$failed = $false
if ($dshCommand) {
  & $dshCommand.Source plugin --profile $Profile add $root
  $failed = -not $?
} else {
  $resources = Join-Path (Split-Path $app) 'resources'
  $bin = Join-Path $resources 'app.asar\dsh\node_modules\@deepseek-ai\dsh\lib\bin.js'
  if (-not (Test-Path (Join-Path $resources 'app.asar'))) {
    throw "The DeepSeek Harness app bundle was not found under $resources"
  }
  $previous = $env:ELECTRON_RUN_AS_NODE
  $env:ELECTRON_RUN_AS_NODE = '1'
  try {
    & $app $bin plugin --profile $Profile add $root
    $failed = -not $?
  } finally {
    if ($null -eq $previous) { Remove-Item Env:ELECTRON_RUN_AS_NODE -ErrorAction SilentlyContinue }
    else { $env:ELECTRON_RUN_AS_NODE = $previous }
  }
}

if ($failed) {
  throw 'dsh plugin add failed.'
}

Write-Host ''
Write-Host "dsh-codex-effort is installed in the '$Profile' profile." -ForegroundColor Green
Write-Host 'Restart DeepSeek Harness, then look for the reasoning-effort pill in the composer toolbar.'
Write-Host "Source: $root"
