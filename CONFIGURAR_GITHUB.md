# ⚠️ IMPORTANTE: Seguridad del Token

## 🔒 Acción Requerida

**Has compartido tu Personal Access Token.** Por seguridad, debes:

1. **Revocar este token inmediatamente** después de subir el proyecto:
   - Ve a: https://github.com/settings/tokens
   - Encuentra el token "Trustlayerc Project" (o el nombre que le diste)
   - Click en "Revoke"

2. **Crear un nuevo token** si necesitas usarlo de nuevo

3. **Nunca compartas tokens** en chats, emails o mensajes públicos

---

## 🚀 Para Subir el Proyecto

Necesito saber:
- Tu nombre de usuario de GitHub
- El nombre del repositorio que creaste (o quieres crear)

Una vez que me digas, configuraré todo y subiré el proyecto.

---

## 📝 Alternativa Segura

Si prefieres hacerlo manualmente:

```powershell
# 1. Crear repositorio en GitHub.com primero
# 2. Luego ejecutar:
git remote add origin https://TU_USUARIO:TU_TOKEN@github.com/TU_USUARIO/NOMBRE_REPO.git
git branch -M main
git push -u origin main
```

Pero es mejor usar el token de forma segura con el helper de credenciales.

