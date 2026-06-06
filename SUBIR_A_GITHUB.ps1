# Script para subir Trustlayerc a GitHub Personal
# Ejecuta este script después de crear el repositorio en GitHub.com

Write-Host "🚀 Subiendo Trustlayerc a GitHub Personal" -ForegroundColor Cyan
Write-Host ""

# Solicitar información del usuario
$githubUser = Read-Host "Ingresa tu nombre de usuario de GitHub"
$repoName = Read-Host "Ingresa el nombre del repositorio (ej: Trustlayerc)"

# Construir URL
$repoUrl = "https://github.com/$githubUser/$repoName.git"

Write-Host ""
Write-Host "📋 Información del repositorio:" -ForegroundColor Yellow
Write-Host "   Usuario: $githubUser" -ForegroundColor Gray
Write-Host "   Repositorio: $repoName" -ForegroundColor Gray
Write-Host "   URL: $repoUrl" -ForegroundColor Gray
Write-Host ""

$confirm = Read-Host "¿Es correcto? (S/N)"
if ($confirm -ne "S" -and $confirm -ne "s") {
    Write-Host "❌ Operación cancelada" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "🔗 Conectando con GitHub..." -ForegroundColor Cyan

# Verificar si ya existe un remote
$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    Write-Host "⚠️  Ya existe un remote 'origin': $existingRemote" -ForegroundColor Yellow
    $replace = Read-Host "¿Reemplazarlo? (S/N)"
    if ($replace -eq "S" -or $replace -eq "s") {
        git remote remove origin
        Write-Host "✅ Remote anterior eliminado" -ForegroundColor Green
    } else {
        Write-Host "❌ Operación cancelada" -ForegroundColor Red
        exit
    }
}

# Agregar remote
git remote add origin $repoUrl
Write-Host "✅ Remote agregado: $repoUrl" -ForegroundColor Green

# Renombrar rama a main
Write-Host ""
Write-Host "📝 Renombrando rama a 'main'..." -ForegroundColor Cyan
git branch -M main
Write-Host "✅ Rama renombrada a 'main'" -ForegroundColor Green

# Verificar estado
Write-Host ""
Write-Host "📊 Estado actual:" -ForegroundColor Cyan
git status

Write-Host ""
Write-Host "🚀 Listo para subir!" -ForegroundColor Green
Write-Host ""
Write-Host "Ejecuta el siguiente comando para subir:" -ForegroundColor Yellow
Write-Host "   git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "Nota: Si GitHub pide autenticación, usa un Personal Access Token" -ForegroundColor Gray
Write-Host "      (no tu contraseña). Crea uno en: https://github.com/settings/tokens" -ForegroundColor Gray
Write-Host ""

$pushNow = Read-Host "¿Subir ahora? (S/N)"
if ($pushNow -eq "S" -or $pushNow -eq "s") {
    Write-Host ""
    Write-Host "⬆️  Subiendo código a GitHub..." -ForegroundColor Cyan
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ ¡Proyecto subido exitosamente!" -ForegroundColor Green
        Write-Host "   Visita: https://github.com/$githubUser/$repoName" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "❌ Error al subir. Verifica:" -ForegroundColor Red
        Write-Host "   1. Que el repositorio exista en GitHub" -ForegroundColor Yellow
        Write-Host "   2. Que tengas permisos de escritura" -ForegroundColor Yellow
        Write-Host "   3. Que uses un Personal Access Token si pide autenticación" -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "📝 Comandos guardados. Ejecuta manualmente:" -ForegroundColor Yellow
    Write-Host "   git push -u origin main" -ForegroundColor White
}

