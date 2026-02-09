import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast"; // 1. Import Toaster
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "KlasKonstruksi - Platform Belajar Konstruksi Online",
    template: "%s | KlasKonstruksi",
  },
  description:
    "Platform e-learning untuk belajar konstruksi, teknik sipil, dan arsitektur secara online dengan video berkualitas tinggi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 2. Pasang Toaster di sini (Paling Atas) */}
        {/* Saya atur posisinya di 'top-center' agar terlihat jelas tapi elegan */}
        <Toaster 
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            // Opsi styling standar biar notifikasinya terlihat modern & bersih
            style: {
              background: '#333',
              color: '#fff',
              fontSize: '14px',
              borderRadius: '8px',
            },
            success: {
              style: {
                background: '#ecfdf5', // Hijau muda soft
                color: '#065f46',      // Hijau tua text
                border: '1px solid #a7f3d0'
              },
            },
            error: {
              style: {
                background: '#fef2f2', // Merah muda soft
                color: '#991b1b',      // Merah tua text
                border: '1px solid #fecaca'
              },
            },
          }}
        />

        {/* 3. Konten Aplikasi */}
        {children}
      </body>
    </html>
  );
}