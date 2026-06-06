# Script para detener todos los servicios

Write-Host "🛑 Deteniendo servicios de Confianza Móvil..." -ForegroundColor Yellow

# Detener procesos en puertos específicos
$ports = @(8545, 1880, 3000)

foreach ($port in $ports) {
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    if ($process) {
        foreach ($pid in $process) {
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            Write-Host "✅ Proceso en puerto $port detenido" -ForegroundColor Green
        }
    }
}

# Detener procesos por nombre
$processes = @("node", "hardhat", "node-red", "next")
foreach ($proc in $processes) {
    Get-Process -Name $proc -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "✅ Todos los servicios han sido detenidos" -ForegroundColor Green










