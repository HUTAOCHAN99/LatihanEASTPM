import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lembar Latihan EAS — Teknologi & Pemrograman Mobile",
  description:
    "Simulasi ujian 150 soal pilihan ganda EAS Teknologi & Pemrograman Mobile, waktu 60 menit, lengkap dengan pembahasan dan riwayat pengerjaan.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className="font-body bg-paper text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
