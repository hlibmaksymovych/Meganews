import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meganews - Clickbait oder Wahrheit?',
  description: 'KI-gestützte Analyse von Nachrichten auf Clickbait und Seriosität',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
