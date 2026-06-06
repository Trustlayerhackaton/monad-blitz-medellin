# 🔐 Configuración de Variables de Entorno

## ⚠️ IMPORTANTE: Seguridad

- **NUNCA** compartas tu clave privada
- **NUNCA** subas el archivo `.env` a GitHub
- El archivo `.env` está en `.gitignore` (no se subirá)

---

## 📝 Crear archivo .env

### Paso 1: Crear el archivo

```bash
cd contracts
touch .env
```

O en Windows:
```powershell
cd contracts
New-Item .env
```

### Paso 2: Agregar tu clave privada

Abre el archivo `.env` y agrega:

```env
PRIVATE_KEY=tu_clave_privada_aqui
```

**Ejemplo:**
```env
PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

### Paso 3: Verificar que no se suba a Git

El archivo `.env` debe estar en `.gitignore`. Verifica:

```bash
cat .gitignore | grep .env
```

Si no aparece, agrega `.env` al `.gitignore`.

---

## 🔑 Cómo Obtener tu Clave Privada

### Desde MetaMask:

1. Abre MetaMask
2. Haz clic en los 3 puntos (menú)
3. Selecciona "Account details"
4. Haz clic en "Export Private Key"
5. Ingresa tu contraseña
6. Copia la clave privada (empieza con `0x`)

**⚠️ ADVERTENCIA**: 
- Nunca compartas tu clave privada
- Usa una wallet dedicada solo para despliegue
- No uses tu wallet principal

---

## 🌐 URLs RPC (Opcionales)

Si quieres usar RPCs personalizados, agrega al `.env`:

```env
# Monad Networks (L1 EVM-compatible)
MONAD_MAINNET_RPC=https://rpc.monad.xyz
MONAD_TESTNET_RPC=https://testnet-rpc.monad.xyz
```

---

## 🔐 API Keys para Verificación (Opcionales)

Para verificar contratos en el explorador (Monadscan):

```env
MONAD_API_KEY=tu_api_key_aqui
```

**Cómo obtener API Keys:**
- **Monad**: https://monadscan.com (sección de APIs)

---

## ✅ Verificar Configuración

Después de crear el `.env`, verifica:

```bash
# Verificar balance (sin desplegar)
npm run check-balance -- --network monad-testnet
npm run check-balance -- --network monad
```

Si funciona, tu configuración es correcta.

---

## 🚨 Seguridad Adicional

### Usar Wallet Dedicada:

1. Crea una nueva wallet en MetaMask
2. Solo transfiere los tokens necesarios para despliegue
3. Usa esta wallet solo para despliegue
4. No uses tu wallet principal

### Backup:

- Guarda tu clave privada en un lugar seguro
- Usa un gestor de contraseñas
- No la guardes en texto plano en tu computadora

---

## 📚 Más Información

- Ver `DESPLIEGUE_MAINNET.md` para guía completa
- Ver `GUIA_MAINNET.md` para información sobre Mainnet

