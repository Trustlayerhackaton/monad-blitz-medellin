# 🚀 Comandos para Subir a tu GitHub Personal

## ✅ Estado Actual

- ✅ Git inicializado
- ✅ Archivos agregados
- ✅ Commit realizado

---

## 📋 Pasos para Subir a GitHub

### 1. **Crear Repositorio en GitHub**

1. Ve a [https://github.com/new](https://github.com/new)
2. **Repository name**: `Trustlayer` (o el nombre que prefieras)
3. **Description**: "Trustlayer - Tu pasaporte financiero digital. Sistema de reputación crediticia basado en blockchain"
4. **Visibility**: 
   - ✅ **Public** (recomendado para hackathon - muestra tu trabajo)
   - ⚠️ Private (si prefieres mantenerlo privado)
5. **NO marques ninguna opción**:
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
6. Haz clic en **"Create repository"**

---

### 2. **Copiar la URL del Repositorio**

Después de crear el repositorio, GitHub te mostrará una página con instrucciones. Copia la URL que aparece, será algo como:

```
https://github.com/TU_USUARIO/Trustlayer.git
```

---

### 3. **Conectar y Subir (Ejecuta estos comandos)**

**Reemplaza `TU_USUARIO` y `NOMBRE_REPO` con tus datos reales:**

```powershell
# Conectar con tu repositorio
git remote add origin https://github.com/TU_USUARIO/NOMBRE_REPO.git

# Verificar que se conectó correctamente
git remote -v

# Renombrar rama a main (si es necesario)
git branch -M main

# Subir todo el código
git push -u origin main
```

---

## 🔐 Autenticación

### Si GitHub te pide usuario y contraseña:

**⚠️ NO uses tu contraseña de GitHub.** Usa un **Personal Access Token**:

1. Ve a: [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. Click en **"Generate new token"** > **"Generate new token (classic)"**
3. Dale un nombre: "Trustlayer Project"
4. Selecciona permisos:
   - ✅ `repo` (acceso completo a repositorios)
5. Click en **"Generate token"**
6. **Copia el token** (solo se muestra una vez)
7. Cuando Git pida contraseña, **pega el token** en lugar de tu contraseña

---

## ✅ Verificación

Después de hacer push, verifica:

```powershell
# Ver el estado
git status

# Ver los remotes configurados
git remote -v

# Ver el último commit
git log --oneline -1
```

Luego ve a tu repositorio en GitHub y verifica que todos los archivos estén ahí.

---

## 🔄 Comandos para Futuros Cambios

Una vez conectado, para futuros cambios:

```powershell
# Ver cambios
git status

# Agregar archivos modificados
git add .

# Hacer commit
git commit -m "Descripción de los cambios"

# Subir cambios
git push
```

---

## 📝 Ejemplo Completo

```powershell
# Si tu usuario es "juanperez" y el repo es "Trustlayer":
git remote add origin https://github.com/juanperez/Trustlayer.git
git branch -M main
git push -u origin main
```

---

## 🆘 Solución de Problemas

### Error: "remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/TU_USUARIO/NOMBRE_REPO.git
```

### Error: "authentication failed"
- Usa Personal Access Token en lugar de contraseña
- Verifica que el token tenga permisos `repo`

### Error: "failed to push some refs"
```powershell
# Si GitHub tiene un README inicial
git pull origin main --allow-unrelated-histories
git push -u origin main
```

---

## 🎯 Checklist Final

- [ ] Repositorio creado en GitHub.com
- [ ] URL del repositorio copiada
- [ ] Comando `git remote add` ejecutado
- [ ] Personal Access Token creado (si es necesario)
- [ ] Comando `git push` ejecutado exitosamente
- [ ] Archivos visibles en GitHub

---

**¡Listo para subir!** 🚀

Después de ejecutar estos comandos, tu proyecto estará en tu GitHub personal y podrás compartirlo con evaluadores, colaboradores o mostrarlo en tu portafolio.

