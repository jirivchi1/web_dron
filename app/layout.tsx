import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cinematografía Aérea - Servicios de Videografía con Drones",
  description: "Eleva tu narrativa con impresionantes videos en 4K capturados con drones. Nos especializamos en capturar los momentos que importan desde ángulos que nunca imaginaste.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
