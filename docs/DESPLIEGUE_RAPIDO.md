# ⚡ Despliegue Rápido - Confianza Móvil

Guía rápida para desplegar backend y frontend.

---

## 🚀 Despliegue Backend (Testnet)

### 1. Configurar Variables de Entorno

```bash
cd contracts
# Crear archivo .env
echo "PRIVATE_KEY=tu_clave_privada_aqui" > .env
```

### 2. Obtener Tokens de Prueba

- **Monad Testnet**: <https://testnet.monad.xyz/faucet>

### 3. Desplegar

```bash
# Monad Testnet
npm run deploy:monad-testnet
```

### 4. Guardar Direcciones

Después del despliegue, copia las direcciones de los contratos del archivo:
`contracts/deployments/[network].json`

---

## 🌐 Despliegue Frontend (Vercel)

### Opción 1: CLI de Vercel

```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

### Opción 2: Dashboard de Vercel

1. Ve a https://vercel.com
2. Conecta tu repositorio de GitHub
3. Configura:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
4. Agrega variables de entorno (Settings → Environment Variables)
5. Deploy

### Variables de Entorno Necesarias

```
NEXT_PUBLIC_MONAD_NFT_CONTRACT=0x...
NEXT_PUBLIC_MONAD_REWARD_CONTRACT=0x...
NEXT_PUBLIC_MONAD_CHAIN_ID=10143
```

---

## ✅ Verificación

1. **Backend**: Verifica contratos en explorador de bloques
2. **Frontend**: Accede a la URL de Vercel y prueba la conexión

---

**¿Problemas?** Consulta `GUIA_DESPLIEGUE.md` para más detalles.


