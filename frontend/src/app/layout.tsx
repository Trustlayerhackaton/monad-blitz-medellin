import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trustlayerc - Tu pasaporte financiero digital",
  description: "Sistema de reputación crediticia basado en blockchain",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}





