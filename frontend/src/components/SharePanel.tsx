"use client";

import { Share2, Twitter, Facebook, Instagram, Copy, Check, Download } from "lucide-react";
import { useState } from "react";

interface SharePanelProps {
  score: number;
  consecutivePayments: number;
  tokenId?: string;
  isDemoMode?: boolean;
}

export function SharePanel({
  score,
  consecutivePayments,
  tokenId,
  isDemoMode = false,
}: SharePanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareText = `🎉 ¡He alcanzado un score de ${score} con ${consecutivePayments} pagos consecutivos en Trustlayer! 🚀\n\n#Trustlayer #Blockchain #DeFi #Fintech`;

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(shareUrl);
    const text = encodeURIComponent(shareText);

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
          "_blank"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${url}`,
          "_blank"
        );
        break;
      case "instagram":
        // Instagram no permite compartir directamente, pero podemos copiar el texto
        const instagramText = `🎉 ¡He alcanzado un score de ${score} con ${consecutivePayments} pagos consecutivos en Trustlayer! 🚀\n\n${shareUrl}\n\n#Trustlayer #Blockchain #DeFi #Fintech`;
        navigator.clipboard.writeText(instagramText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        alert("Texto copiado. Pégalo en tu publicación de Instagram.");
        break;
      case "copy":
        navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
    }
  };

  const generateShareImage = () => {
    // Crear un canvas con la información del NFT
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // Fondo gradiente
      const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
      gradient.addColorStop(0, "#4F46E5");
      gradient.addColorStop(1, "#7C3AED");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1200, 630);

      // Texto
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 64px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Trustlayer", 600, 150);
      ctx.font = "48px Arial";
      ctx.fillText(`Score: ${score}`, 600, 250);
      ctx.fillText(`${consecutivePayments} Pagos Consecutivos`, 600, 320);
      ctx.font = "36px Arial";
      ctx.fillText("Tu pasaporte financiero digital", 600, 400);

      // Descargar imagen
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `Trustlayer-${score}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300"
        style={{ 
          backgroundColor: 'transparent',
          border: '1px solid #00FF87',
          color: '#00FF87'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 255, 135, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
        title="Compartir Logros"
      >
        <Share2 className="w-4 h-4" />
        <span className="font-semibold">Compartir Logros</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl z-50 p-4 backdrop-blur-sm" style={{ backgroundColor: '#1A2332', border: '1px solid rgba(0, 255, 135, 0.2)', boxShadow: '0 0 30px rgba(0, 255, 135, 0.2)' }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: '#00FF87', letterSpacing: '-0.02em' }}>
            Compartir en Redes Sociales
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => handleShare("facebook")}
              className="w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-300"
              style={{ 
                backgroundColor: 'rgba(0, 255, 135, 0.05)',
                border: '1px solid rgba(0, 255, 135, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 255, 135, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(0, 255, 135, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 255, 135, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(0, 255, 135, 0.1)';
              }}
            >
              <Facebook className="w-5 h-5" style={{ color: '#00FF87' }} />
              <span className="font-medium" style={{ color: '#FFFFFF' }}>Publicar en Facebook</span>
            </button>
            <button
              onClick={() => handleShare("twitter")}
              className="w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-300"
              style={{ 
                backgroundColor: 'rgba(0, 255, 135, 0.05)',
                border: '1px solid rgba(0, 255, 135, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 255, 135, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(0, 255, 135, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 255, 135, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(0, 255, 135, 0.1)';
              }}
            >
              <Twitter className="w-5 h-5" style={{ color: '#00FF87' }} />
              <span className="font-medium" style={{ color: '#FFFFFF' }}>Publicar en X (Twitter)</span>
            </button>
            <button
              onClick={() => handleShare("instagram")}
              className="w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-300"
              style={{ 
                backgroundColor: 'rgba(0, 255, 135, 0.05)',
                border: '1px solid rgba(0, 255, 135, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 255, 135, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(0, 255, 135, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 255, 135, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(0, 255, 135, 0.1)';
              }}
            >
              <Instagram className="w-5 h-5" style={{ color: '#00FF87' }} />
              <span className="font-medium" style={{ color: '#FFFFFF' }}>Publicar en Instagram</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

