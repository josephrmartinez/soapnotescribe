import '@/app/ui/global.css'
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | advocate.ai',
    default: 'advocate.ai',
  },
  description: 'A personalized health advocate that helps you prepare for, record, and review your medical appointments.',
  metadataBase: new URL('https://https://advocateai.vercel.app/'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
