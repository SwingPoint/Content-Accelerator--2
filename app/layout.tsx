import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Content Accelerator',
  description: 'Generate complete 5-day content packs from a single seed',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

