# 🔧 Solución a Problemas de Permisos con Git

## 🔍 Problema Detectado

- ✅ Git está instalado (versión 2.51.0)
- ⚠️ Existe un directorio `.git` pero con problemas de permisos
- ⚠️ No se puede acceder al repositorio Git

---

## ✅ Solución Rápida

### Opción 1: Eliminar y Recrear .git (Recomendado)

**Ejecuta estos comandos en PowerShell como Administrador:**

```powershell
# 1. Navegar al directorio del proyecto
cd E:\HACKATHON131125

# 2. Eliminar el directorio .git problemático
Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue

# 3. Inicializar Git nuevamente
git init

# 4. Agregar todos los archivos
git add .

# 5. Hacer commit inicial
git commit -m "Initial commit: Trustlayer - Tu pasaporte financiero digital"
```

---

### Opción 2: Arreglar Permisos del Directorio .git

```powershell
# 1. Tomar ownership del directorio
Takeown /F .git /R /D Y

# 2. Dar permisos completos
icacls .git /grant Administrators:F /T

# 3. Intentar nuevamente
git status
```

---

### Opción 3: Usar Git desde otra ubicación

Si los problemas persisten, puedes:

1. **Copiar el proyecto a otra ubicación** (sin el .git):
   ```powershell
   # Crear copia en otra ubicación
   Copy-Item -Path "E:\HACKATHON131125" -Destination "E:\HACKATHON131125_NEW" -Recurse -Exclude ".git"
   
   # Ir a la nueva ubicación
   cd E:\HACKATHON131125_NEW
   
   # Inicializar Git
   git init
   git add .
   git commit -m "Initial commit: Trustlayer"
   ```

---

## 📋 Comandos Completos para Guardar el Proyecto

**Una vez resuelto el problema de permisos, ejecuta:**

```powershell
# 1. Verificar que estás en el directorio correcto
cd E:\HACKATHON131125

# 2. Inicializar Git (si no existe .git)
git init

# 3. Verificar estado
git status

# 4. Agregar todos los archivos
git add .

# 5. Verificar qué se va a commitear
git status

# 6. Hacer commit
git commit -m "Initial commit: Trustlayer - Tu pasaporte financiero digital

Características:
- Frontend completo con Next.js 14 y React 18
- Contratos inteligentes (CreditNFT, RewardSystem, MockMonad)
- Sistema de gamificación y recompensas
- Dashboard con múltiples secciones
- Integración con MetaMask
- Documentación completa"

# 7. Verificar el commit
git log --oneline
```

---

## 🔗 Comandos para Conectar con GitHub

**Después de hacer el commit, para conectar con GitHub:**

```powershell
# 1. Agregar remote (REEMPLAZA USERNAME y REPO_NAME)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# 2. Verificar
git remote -v

# 3. Renombrar rama a main (si es necesario)
git branch -M main

# 4. Subir código
git push -u origin main
```

**Nota**: Necesitarás crear el repositorio en GitHub primero. Ver `COMANDOS_GITHUB.md` para instrucciones detalladas.

---

## ✅ Verificación Final

Después de ejecutar los comandos, verifica:

```powershell
# Ver estado
git status

# Ver último commit
git log --oneline -1

# Ver archivos rastreados
git ls-files | Measure-Object -Line

# Ver remotes configurados
git remote -v
```

---

## 🆘 Si Nada Funciona

1. **Usa GitHub Desktop** (interfaz gráfica):
   - Descarga: https://desktop.github.com/
   - Abre el proyecto
   - Haz commit y push desde la interfaz

2. **Reinstala Git**:
   - Descarga desde: https://git-scm.com/download/win
   - Durante instalación, selecciona "Run Git from Windows Command Prompt"

3. **Contacta soporte** si el problema persiste

---

## 📚 Archivos de Referencia

- `COMANDOS_GITHUB.md` - Comandos para conectar con GitHub
- `GUIA_GITHUB.md` - Guía completa
- `INSTRUCCIONES_GIT_MANUAL.md` - Instrucciones alternativas

---

**¡Todo está preparado! Solo necesitas resolver el problema de permisos y ejecutar los comandos.** 🚀

