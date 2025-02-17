import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SciencePlay - Citizen Science Gaming Platform',
  description: 'Making scientific discovery accessible through the power of play.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-primary">{children}</body>
    </html>
  );
};