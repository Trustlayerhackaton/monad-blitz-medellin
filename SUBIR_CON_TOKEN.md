# 🚀 Subir Proyecto con Token

## ⚠️ IMPORTANTE: Seguridad

**Tu token ha sido compartido. Después de subir el proyecto, REVÓCALO inmediatamente:**
- Ve a: https://github.com/settings/tokens
- Encuentra el token y haz click en "Revoke"
- Crea uno nuevo si lo necesitas

---

## 📋 Información Necesaria

Para subir el proyecto, necesito:
1. **Tu usuario de GitHub**: _______________
2. **Nombre del repositorio**: _______________

---

## 🔧 Comandos para Ejecutar

**Reemplaza `TU_USUARIO` y `NOMBRE_REPO` con tus datos:**

```powershell
# 1. Agregar remote con token
git remote add origin https://TU_USUARIO:TU_TOKEN_AQUI@github.com/TU_USUARIO/NOMBRE_REPO.git

# 2. Renombrar rama
git branch -M main

# 3. Subir código
git push -u origin main
```

---

## ✅ Alternativa Más Segura

En lugar de poner el token en el comando, puedes:

1. **Crear el repositorio en GitHub.com primero**
2. **Ejecutar estos comandos:**

```powershell
# Agregar remote (sin token en la URL)
git remote add origin https://github.com/TU_USUARIO/NOMBRE_REPO.git

# Renombrar rama
git branch -M main

# Al hacer push, Git pedirá credenciales
# Usuario: TU_USUARIO
# Contraseña: Pega el token aquí
git push -u origin main
```

---

## 🎯 Pasos Rápidos

1. **Crear repositorio en GitHub.com** (si no existe)
2. **Dime tu usuario y nombre del repo**
3. **Ejecuto los comandos por ti**

---

**Nota**: El token en este archivo debe ser eliminado después de usarlo.

